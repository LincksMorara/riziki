import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import dayjs from 'dayjs';

const ProfitVsExpensesLineChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [intervalDays, setIntervalDays] = useState(7); // Default interval of 7 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = dayjs();
        const startDate = endDate.subtract(120, 'day'); // Fetch data for the last 120 days

        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = endDate.format('YYYY-MM-DD');

        // Fetching expenses data
        const expensesResponse = await axios.get(`https://riziki-backend-ft22.onrender.com/api/expenses?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const expensesData = expensesResponse.data.data || [];

        // Fetching sales data
        const salesResponse = await axios.get(`https://riziki-backend-ft22.onrender.com/api/sales/sales-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const salesData = salesResponse.data.sales || [];

        // Generate an array of dates within the range
        const dateRange = [];
        for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
          dateRange.push(date.format('YYYY-MM-DD'));
        }

        // Create a mapping of date to profit and expenses
        const profitMap = salesData.reduce((acc, sale) => {
          const date = dayjs(sale.date).format('YYYY-MM-DD');
          acc[date] = (acc[date] || 0) + sale.profit;
          return acc;
        }, {});

        const expensesMap = expensesData.reduce((acc, expense) => {
          const date = dayjs(expense.timestamp).format('YYYY-MM-DD');
          acc[date] = (acc[date] || 0) + expense.amount;
          return acc;
        }, {});

        // Function to calculate cumulative data based on selected interval
        const calculateCumulativeData = (dataMap, interval) => {
          const cumulativeData = [];
          for (let i = 0; i < dateRange.length; i += interval) {
            let intervalSum = 0;
            for (let j = 0; j < interval; j++) {
              const date = dateRange[i + j];
              if (date) {
                intervalSum += dataMap[date] || 0;
              }
            }
            cumulativeData.push(intervalSum);
          }
          return cumulativeData;
        };

        // Calculate cumulative profit and expenses based on selected interval
        const cumulativeProfitData = calculateCumulativeData(profitMap, intervalDays);
        const cumulativeExpensesData = calculateCumulativeData(expensesMap, intervalDays);

        // Prepare labels for the chart based on intervals
        const labels = [];
        for (let i = intervalDays; i <= 120; i += intervalDays) { // Adjusted to 120 days
          labels.push(`Day ${i}`);
        }

        // Determine aspect ratio based on interval
        let aspectRatio = 2; // Default aspect ratio (more wide than tall)
        if (intervalDays === 7 || intervalDays === 14 || intervalDays === 30) {
          aspectRatio = 1.5; // Narrower for 7, 14, and 30 days interval
        }

        // Prepare chart data with cumulative profit and expenses datasets
        const data = {
          labels: labels,
          datasets: [
            {
              label: 'Cumulative Profit',
              data: cumulativeProfitData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              fill: false,
            },
            {
              label: 'Cumulative Expenses',
              data: cumulativeExpensesData,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              fill: false,
            },
          ],
        };

        // Destroy existing chart instance if exists and create new chart
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: aspectRatio, // Set aspect ratio dynamically
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Day',
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Amount',
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    fetchData();
  }, [intervalDays]); // Trigger useEffect whenever intervalDays changes

  // Function to handle interval change
  const handleIntervalChange = (event) => {
    const selectedInterval = parseInt(event.target.value);
    setIntervalDays(selectedInterval);
  };

  return (
    <div>
      <canvas ref={chartRef} style={{ maxWidth: '800px', maxHeight: '400px' }} />
      <div>
        {/* Dropdown to select interval */}
        <label htmlFor="intervalSelect">Select Interval:</label>
        <select id="intervalSelect" value={intervalDays} onChange={handleIntervalChange}>
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
        </select>
      </div>
    </div>
  );
};

export default ProfitVsExpensesLineChart;
