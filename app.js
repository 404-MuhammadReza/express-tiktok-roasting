const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Berhasil terhubung ke MongoDB'))
  .catch(err => {
    console.error('❌ Gagal terhubung ke MongoDB:', err);
    process.exit(1);
  });

const routes = require('./routes/route');
app.use('/api/', routes);

app.get('/', (req, res) => {
  res.send('Server berjalan di Vercel');
});

module.exports = app;