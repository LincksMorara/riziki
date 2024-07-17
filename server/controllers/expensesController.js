// controllers/expensesController.js
const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    try {
      const { description, amount, category } = req.body;
      const timestamp = new Date(); // Create a timestamp for the current date and time
      const newExpense = new Expense({ description, amount, category, timestamp });
      await newExpense.save();
      res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  exports.getExpenses = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    // Parse the simple date format to a full ISO date string
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T23:59:59Z`);
    
    try {
      const expenses = await Expense.find({
        timestamp: { $gte: start, $lte: end }
      });
      res.status(200).json({ success: true, data: expenses });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };