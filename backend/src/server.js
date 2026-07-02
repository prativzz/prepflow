import 'dotenv/config';
import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepflow';

const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Successfully!');
  } catch (error) {
    console.error('❌ FATAL: Failed to connect to MongoDB!', error.message);
    console.error('👉 If you are using MongoDB Atlas, please ensure your current IP address is whitelisted in the Network Access settings.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
