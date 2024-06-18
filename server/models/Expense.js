// Import the mongoose module, which provides a straightforward, schema-based solution to model your application data with MongoDB
const mongoose = require('mongoose');

// Define a schema for an expense, including the amount, description, and timestamp of the expense
const expenseSchema = new mongoose.Schema({
    amount: Number, // The amount of the expense
    description: String, // A description of the expense
    timestamp: {type: Date, default: Date.now} // The timestamp of when the expense was created, defaulting to the current date and time
});

// Export a model for the expense using the expense schema
module.exports = mongoose.model('Expense', expenseSchema);