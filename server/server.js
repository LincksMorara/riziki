// Import the express module to create an Express application
const express = require('express');

// Import the mongoose module to connect to MongoDB
const mongoose = require('mongoose');

// Import the body-parser module to parse incoming request bodies
const bodyParser = require('body-parser');

// Import the dotenv module to load environment variables from a .env file
const dotenv = require('dotenv');

// Import the auth routes
const authRoutes = require('./routes/auth');

// Import the user routes
const userRoutes = require('./routes/user');

// Import the function to connect to the database
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Connect to the database and log a message depending on whether the connection was successful
connectDB().then(() => {
    console.log('DB Connected');
}).catch((err) => {console.log('MongoDB connection failed', err)});

// Use the auth routes for requests to /api/auth
app.use('/api/auth', authRoutes);

// Use the user routes for requests to /api/user
app.use('/api/user', userRoutes);

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
}); 