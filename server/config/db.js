// Import the mongoose module to connect to MongoDB
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database
const connectDB = async () => {
    try {
        // Try to connect to the database using the connection string from the environment variables
        await mongoose.connect(process.env.MONGO_URI);
        // If the connection is successful, log a message (currently commented out)
        //console.log('DB Connected');
    } catch (err) {
        // If an error occurred during the connection, log the error message
        console.log('MongoDB connection failed', err);
    }
};

// Export the connectDB function to be used in other files
module.exports = connectDB;