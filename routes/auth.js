// File untuk mengatur API registrasi dan login

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route untuk Register
router.post('/register', async (req, res) => {
  const { nama_lengkap, username, password } = req.body;
  
  // Validasi input
  if (!nama_lengkap || !username || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user ke database
  db.query('INSERT INTO users (nama_lengkap, username, password) VALUES (?, ?, ?)', 
    [nama_lengkap, username, hashedPassword], 
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'User created successfully' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
  });
});

module.exports = router;
