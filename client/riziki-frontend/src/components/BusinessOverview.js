// Import React library, useState and useEffect hooks from 'react'
import React, { useState, useEffect } from 'react';
// Import axios for making HTTP requests
import axios from 'axios';

// Define the BusinessOverview component with props for handling period change and setting custom data
const BusinessOverview = ({ onPeriodChange, setCustomData }) => {
  // State for the selected period with default value 'daily'
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  // State for storing revenue data with default values
  const [revenueData, setRevenueData] = useState({ revenue: 0, quantity: 0, profit: 0 });
  // State for storing expenses data with default value
  const [expensesData, setExpensesData] = useState({ totalAmount: 0 });
  // State for storing purchases data with default values
  const [purchasesData, setPurchasesData] = useState({ totalAmount: 0, totalQuantity: 0 });

  // useEffect hook to fetch data whenever selectedPeriod changes
  useEffect(() => {
    // Define async function to fetch data based on the period
    const fetchData = async (period) => {
      try {
        // Set endDate to current date and time
        const endDate = new Date();
        let startDate;

        // Determine startDate based on the selected period
        if (period === 'daily') {
          // For daily, set startDate to the start of the current day
          startDate = new Date(endDate);
          startDate.setHours(0, 0, 0, 0);
        } else {
          // For weekly and monthly, adjust startDate accordingly
          switch (period) {
            case 'weekly':
              startDate = new Date(endDate);
              startDate.setDate(endDate.getDate() - 7);
              break;
            case 'monthly':
              startDate = new Date(endDate);
              startDate.setDate(endDate.getDate() - 28);
              break;
            default:
              break;
          }
        }

        // Fetch sales data from API
        const salesResponse = await axios.get(`http://localhost:8000/api/sales/sales-by-date-range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        const sales = salesResponse.data.sales;
        // Calculate total revenue and quantity from sales data
        const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
        const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
        // Calculate total profit from sales data
        const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);
        // Update revenue data state
        setRevenueData({ revenue: totalRevenue, quantity: totalQuantity, profit: totalProfit });

        // Fetch expenses data from API
        const expensesResponse = await axios.get(`http://localhost:8000/api/expenses?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
        const expenses = expensesResponse.data.data;
        // Calculate total expenses amount
        const totalExpensesAmount = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        // Update expenses data state
        setExpensesData({ totalAmount: totalExpensesAmount });

        // Fetch purchases data from API
        const purchasesResponse = await axios.get(`http://localhost:8000/api/inventory/batches-by-date-range?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
        const purchases = purchasesResponse.data.data;
        // Calculate total purchases amount and quantity
        const totalPurchasesAmount = purchases.reduce((acc, purchase) => acc + purchase.totalPrice, 0);
        const totalPurchasesQuantity = purchases.reduce((acc, purchase) => acc + purchase.quantity, 0);
        // Update purchases data state
        setPurchasesData({ totalAmount: totalPurchasesAmount, totalQuantity: totalPurchasesQuantity });

        // Update custom data for use in AdminDashboard
        setCustomData({
          sales: { totalRevenue, totalQuantity },
          expenses: { totalAmount: totalExpensesAmount },
          purchases: { totalAmount: totalPurchasesAmount, totalQuantity: totalPurchasesQuantity },
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        });
      } catch (error) {
        // Log error if fetching data fails
        console.error('Error fetching data:', error);
      }
    };

    // Call fetchData with the current selectedPeriod
    fetchData(selectedPeriod);
  }, [selectedPeriod, setCustomData]); // Dependencies for useEffect

  // Handle period selection change
  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    // Update selectedPeriod state
    setSelectedPeriod(newPeriod);
    // Call onPeriodChange prop function with new period
    onPeriodChange(newPeriod);
  };

  // Render the component
  return (
    <div>
      <h2>Business Overview</h2>
      <div>
        <label htmlFor="period-select">Select period:</label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={handlePeriodChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {selectedPeriod !== 'custom' && (
        <div>
          <div className="card">
            <h3>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Revenue</h3>
            <p>Total Revenue: {revenueData.revenue}</p>
            <p>Total Quantity: {revenueData.quantity}</p>
            <p>Total Profit: {revenueData.profit}</p>
          </div>
          <div className="card">
            <h3>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Expenses</h3>
            <p>Total Amount: {expensesData.totalAmount}</p>
          </div>
          <div className="card">
            <h3>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Purchases</h3>
            <p>Total Amount: {purchasesData.totalAmount}</p>
            <p>Total Quantity: {purchasesData.totalQuantity}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the BusinessOverview component
export default BusinessOverview;