const express = require('express');
const app = express();

app.use(express.json());

const routes = require('./routes/route');
app.use('/api/', routes);

app.get('/', (req, res) => {
  res.send('Server berjalan di Vercel');
});

module.exports = app;