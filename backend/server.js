/**
 * Express Server Entry Point
 * MERN Hackathon Management Platform
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Import Modular Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const teamRoutes = require('./routes/teamRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON data
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data

// Cross-Origin Resource Sharing (CORS) Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Hackathon Management Platform Backend API is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

// Register Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Hackathon Management System API Endpoint');
});

// 404 Route Not Found Middleware
app.use(notFoundHandler);

// Global Centralized Error Handler Middleware
app.use(errorHandler);

// Server Listening Configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

module.exports = app;
