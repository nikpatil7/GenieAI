const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv'); 
const { connect } = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

//routes path
const authRoutes = require('./routes/authRoutes');
const openaiRoutes = require('./routes/openaiRoutes');

//dotenv
dotenv.config();

//mongo connection
connectDB();

//rest obj
const app = express();

//middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/openai', openaiRoutes);

// Error Handler Middleware - should be last
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.DEV_MODE} on port ${PORT}`.yellow.bold);
});

// Global error handler
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
});