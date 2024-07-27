const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes'); // Import inventoryRoutes
const reportRoutes = require('./routes/reportRoutes'); // Import reportRoutes
const salesRoutes = require('./routes/salesRoutes'); // Import salesRoutes
const expensesRoutes = require('./routes/expensesRoutes'); //Import expensesRoutes
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Use cors middleware to enable CORS
app.use(cors({
    origin: 'https://riziki-frontend.onrender.com', // reflect the request origin
    methods: ['GET', 'POST','PUT'], // allow these methods
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

//user the inventoryRoutes for requests to /api/inventory
app.use('/api/inventory', inventoryRoutes);

//use the salesRoutes for requests to /api/sales
app.use('/api/sales', salesRoutes);

//use the expensesRoutes for requests to /api/expenses
app.use('/api/expenses', expensesRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Define the port the server will listen on
const PORT = process.env.PORT || 8000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
