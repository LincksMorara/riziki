const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use cors middleware to enable CORS
app.use(cors({
    origin: true, // reflect the request origin
    methods: ['GET', 'POST'], // allow these methods
    allowedHeaders: ['Content-Type'], // allow this header
}));

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Connect to the database
connectDB().then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.error('MongoDB connection failed', err);
});

// Use the auth routes for requests to /api/auth
app.use('/api/auth', authRoutes);

// Use the user routes for requests to /api/user
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
