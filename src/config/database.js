const mongoose = require('mongoose');

const mongooConnect = async (retries = 5) => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not configured in .env');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.info('Successfully connected to MongoDB');

  } catch (e) {
    console.error('Failed to connect to MongoDB:', e);
    process.exit(1);
  }
};

module.exports = { mongooConnect };