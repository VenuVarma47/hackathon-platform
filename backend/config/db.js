/**
 * MongoDB Database Connection Setup using Mongoose
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackathon_platform_db');
    
    console.log(`==================================================`);
    console.log(` MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(` Database Name: ${conn.connection.name}`);
    console.log(`==================================================`);
  } catch (error) {
    console.error(` Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
