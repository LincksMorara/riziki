import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const ProfitVsExpensesPieChart = ({ startDate, endDate }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profitResponse = await axios.get(`http://localhost:8000/api/sales/profit?startDate=${startDate}&endDate=${endDate}`);
        const expensesResponse = await axios.get(`http://localhost:8000/api/expenses?startDate=${startDate}&endDate=${endDate}`);
        const totalProfit = profitResponse.data.totalProfit || 0;
        const totalExpenses = expensesResponse.data.data.reduce((acc, expense) => acc + expense.amount, 0) || 0;

        const data = {
          labels: ['Profit', 'Expenses'],
          datasets: [{
            data: [totalProfit, totalExpenses],
            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          }]
        };

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
          type: 'pie',
          data: data,
        });
      } catch (error) {
        console.error('Error fetching data for pie chart:', error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return <canvas ref={chartRef} />;
};

export default ProfitVsExpensesPieChart;
