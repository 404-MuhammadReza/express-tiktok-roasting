const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'https://frontend-tiktok-roasting-7zmoao8et.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Memungkinkan permintaan tanpa origin (misalnya, dari aplikasi seluler atau permintaan file)
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

const routes = require('./routes/route');
app.use('/api/', routes);

app.get('/', (req, res) => {
  res.send('Server berjalan di Vercel');
});

module.exports = app;