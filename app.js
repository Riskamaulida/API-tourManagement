// File untuk mengatur server Node.js
// Menggunakan Express untuk membuat server
// Menggunakan dotenv untuk mengatur variabel lingkungan

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan route untuk autentikasi
app.use('/api', authRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});