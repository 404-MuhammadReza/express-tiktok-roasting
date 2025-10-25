const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

const routes = require('./routes/route');
app.use('/api/', routes);

app.get('/', (req, res) => {
  res.send('Server berjalan di Vercel');
});

module.exports = app;