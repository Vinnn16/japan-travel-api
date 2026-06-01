const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: [
    "https://japan-travel-app.azurewebsites.net",
    "http://localhost:5173"
  ]
}));
app.use(express.json());

// Koneksi database dengan connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Wajib untuk Azure MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Inisialisasi tabel saat server start
async function initDatabase() {
  try {
    const conn = await pool.getConnection();

    // Tabel contact_messages
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        topic VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabel customer_reviews
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS customer_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    conn.release();
    console.log("Database tables initialized successfully!");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
}

// ===== ROUTES =====

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Japan Travel API is running!" });
});

// --- Contact Us ---

// POST /api/contact — kirim pesan
app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, phone, topic, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Field wajib tidak boleh kosong." });
  }

  try {
    await pool.execute(
      "INSERT INTO contact_messages (first_name, last_name, email, phone, topic, message) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone || null, topic || null, message]
    );
    res.status(201).json({ success: true, message: "Pesan berhasil dikirim!" });
  } catch (err) {
    console.error("Contact error:", err.message);
    res.status(500).json({ error: "Gagal menyimpan pesan." });
  }
});

// GET /api/contact — ambil semua pesan (admin)
app.get("/api/contact", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

// --- Customer Reviews ---

// GET /api/reviews — ambil semua review
app.get("/api/reviews", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM customer_reviews ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil review." });
  }
});

// POST /api/reviews — kirim review baru
app.post("/api/reviews", async (req, res) => {
  const { name, origin, destination, rating, comment } = req.body;

  if (!name || !origin || !destination || !rating || !comment) {
    return res.status(400).json({ error: "Semua field wajib diisi." });
  }

  try {
    await pool.execute(
      "INSERT INTO customer_reviews (name, origin, destination, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [name, origin, destination, parseInt(rating), comment]
    );
    res.status(201).json({ success: true, message: "Review berhasil dikirim!" });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: "Gagal menyimpan review." });
  }
});

// Start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
});
