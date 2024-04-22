const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 9090; // Port yang akan digunakan oleh server

app.use(bodyParser.json());

// Membuat koneksi dengan database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "notif", // Nama database
});

// Menghubungkan ke database MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Terhubung ke database MySQL");
});

// Middleware untuk mengizinkan CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware untuk parsing JSON dan penanganan kesalahan parsing
app.use(bodyParser.json(), (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    res.status(400).send({ error: "Invalid JSON" });
  } else {
    next();
  }
});

// Endpoint untuk menerima notifikasi
app.post("/notification", (req, res) => {
  const { packageName, title, text } = req.body;
  console.log("Received Notification:");
  console.log("Package Name:", packageName);
  console.log("Title:", title);
  console.log("Text:", text);

  // Query SQL untuk menyimpan data notifikasi ke dalam tabel notifications
  const sql =
    "INSERT INTO notifications (packageName, title, text) VALUES (?, ?, ?)";
  db.query(sql, [packageName, title, text], (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Data notifikasi disimpan");
    res.sendStatus(200); // Mengirim respons OK
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
