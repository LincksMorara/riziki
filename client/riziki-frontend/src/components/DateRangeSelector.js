import React, { useState } from 'react';
import axios from 'axios';

const DateRangeSelector = ({ setCustomData }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFetchData = async () => {
    try {
      // Fetch Sales Data
      const salesResponse = await axios.get(`https://riziki-backend-ft22.onrender.com/api/sales/sales-by-date-range?startDate=${startDate}&endDate=${endDate}`);
      const sales = salesResponse.data.sales;
      const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
      const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);

      // Fetch Expenses Data
      const expensesResponse = await axios.get(`https://riziki-backend-ft22.onrender.com/api/expenses?startDate=${startDate}&endDate=${endDate}`);
      const expenses = expensesResponse.data.data;
      const totalExpensesAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);

      // Fetch Purchases Data
      const purchasesResponse = await axios.get(`https://riziki-backend-ft22.onrender.com/api/inventory/batches-by-date-range?startDate=${startDate}&endDate=${endDate}`);
      const purchases = purchasesResponse.data.data;
      const totalPurchasesAmount = purchases.reduce((acc, purchase) => acc + purchase.totalPrice, 0);
      const totalPurchasesQuantity = purchases.reduce((acc, purchase) => acc + purchase.quantity, 0);

      // Set Custom Data in AdminDashboard
      setCustomData({
        sales: { totalRevenue, totalQuantity },
        expenses: { totalAmount: totalExpensesAmount },
        purchases: { totalAmount: totalPurchasesAmount, totalQuantity: totalPurchasesQuantity },
        startDate,
        endDate,
      });
    } catch (error) {
      console.error('Error fetching custom date range data:', error);
      // Ensure startDate and endDate are still set in case of error
      setCustomData({
        sales: { totalRevenue: 0, totalQuantity: 0 },
        expenses: { totalAmount: 0 },
        purchases: { totalAmount: 0, totalQuantity: 0 },
        startDate,
        endDate,
      });
    }
  };

  return (
    <div>
      <h3>Select Custom Date Range</h3>
      <div>
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={handleFetchData}>Fetch Data</button>
    </div>
  );
};

export default DateRangeSelector;
