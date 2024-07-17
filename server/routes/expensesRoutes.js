// routes/expensesRoutes.js
const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

router.post('/add', expensesController.addExpense);
router.get('/', expensesController.getExpenses);

module.exports = router;