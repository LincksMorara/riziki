import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import dayjs from 'dayjs';

const ProfitVsExpensesLineChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [intervalDays, setIntervalDays] = useState(4); // Default interval of 4 days

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = dayjs();
        const startDate = endDate.subtract(112, 'day');

        const formattedStartDate = startDate.format('YYYY-MM-DD');
        const formattedEndDate = endDate.format('YYYY-MM-DD');

        // Fetching expenses data
        const expensesResponse = await axios.get(`http://localhost:8000/api/expenses?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const expensesData = expensesResponse.data.data || [];

        // Fetching sales data
        const salesResponse = await axios.get(`http://localhost:8000/api/sales/sales-by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const salesData = salesResponse.data.sales || [];

        // Function to calculate cumulative data based on selected interval
        const calculateCumulativeData = (data, interval, key) => {
          const cumulativeData = [];
          let cumulativeSum = 0;
          for (let i = 0; i < data.length; i++) {
            cumulativeSum += data[i][key];
            if ((i + 1) % interval === 0 || i === data.length - 1) {
              cumulativeData.push(cumulativeSum);
            }
          }
          return cumulativeData;
        };

        // Calculate cumulative profit and expenses based on selected interval
        const cumulativeProfitData = calculateCumulativeData(salesData, intervalDays, 'profit');
        const cumulativeExpensesData = calculateCumulativeData(expensesData, intervalDays, 'amount');

        // Prepare labels for the chart based on intervals
        const labels = [];
        for (let i = intervalDays; i <= 112; i += intervalDays) {
          labels.push(`Day ${i}`);
        }

        // Determine aspect ratio based on interval
        let aspectRatio = 2; // Default aspect ratio (more wide than tall)
        if (intervalDays === 1) {
          aspectRatio = 3; // Wider than tall for 1 day interval
        } else if (intervalDays === 2) {
          aspectRatio = 2.5; // Moderately wide for 2 days interval
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
          <option value={4}>4 Days</option>
          <option value={2}>2 Days</option>
          <option value={1}>1 Day</option>
        </select>
      </div>
    </div>
  );
};

export default ProfitVsExpensesLineChart;
