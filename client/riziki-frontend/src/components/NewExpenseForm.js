import React from 'react';

const NewExpenseForm = () => {
  // Placeholder logic
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    console.log('Submitting new expense form...');
  };

  return (
    <div>
      <h2>New Expense Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="expenseName">Expense Name:</label>
        <input type="text" id="expenseName" name="expenseName" required />

        <label htmlFor="expenseAmount">Amount:</label>
        <input type="number" id="expenseAmount" name="expenseAmount" required />

        <button type="submit">Submit Expense</button>
      </form>
    </div>
  );
};

export default NewExpenseForm;
