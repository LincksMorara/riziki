import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NewExpenseForm = () => {
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [daysBack, setDaysBack] = useState(1); // Default to 1 day back

  const fetchData = useCallback(async () => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - daysBack + 1); // Start from today - daysBack
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 1); // End at today (exclusive)

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const response = await axios.get(`http://localhost:8000/api/expenses?startDate=${startDateStr}&endDate=${endDateStr}`);
      setExpenses(response.data.data); // Ensure the data is set correctly
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }, [daysBack]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/expenses/add', {
        description: expenseDescription,
        amount: expenseAmount,
        category: expenseCategory
      });
      console.log('Expense submitted successfully:', response.data);
      // Optionally, update state or fetch new data
      setExpenseDescription('');
      setExpenseAmount('');
      setExpenseCategory('');
      fetchData(); // Refresh the expenses table after adding a new expense
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const handleDaysBackChange = (e) => {
    setDaysBack(Number(e.target.value));
  };

  return (
    <div>
      <h2>New Expense Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="expenseDescription">Expense Description:</label>
        <input
          type="text"
          id="expenseDescription"
          name="expenseDescription"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
          required
        />

        <label htmlFor="expenseAmount">Amount:</label>
        <input
          type="number"
          id="expenseAmount"
          name="expenseAmount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
        />

        <label htmlFor="expenseCategory">Category:</label>
        <input
          type="text"
          id="expenseCategory"
          name="expenseCategory"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          required
        />

        <button type="submit">Submit Expense</button>
      </form>

      <h3>Filter Expenses</h3>
      <label htmlFor="daysBackSelect">Days Back:</label>
      <select id="daysBackSelect" value={daysBack} onChange={handleDaysBackChange}>
        <option value={1}>1 day</option>
        <option value={7}>7 days</option>
        <option value={30}>30 days</option>
      </select>

      <h3>Expenses Table</h3>
      {Array.isArray(expenses) && expenses.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>{new Date(expense.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses found for the selected period.</p>
      )}
    </div>
  );
};

export default NewExpenseForm;
