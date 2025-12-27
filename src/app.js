const express = require('express');
const cors = require('cors');
const { mongooConnect } = require('./config/database');
const routes = require('./routes/route');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

mongooConnect();
app.use('/api/', routes);
app.use((req, res) => {
  res.status(404).json({ error: 'Route Not Found!' });
});

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Local Server Running at http://localhost:${port}`));
} else {
  app.get('/', (req, res) => res.send('Server Running at Vercel'));
}

module.exports = app;
