document.addEventListener('DOMContentLoaded', function() {
    // Expenses Pie Chart
    const expensesCtx = document.getElementById('expenses-piechart').getContext('2d');
    new Chart(expensesCtx, {
        type: 'pie',
        data: {
            labels: ['Expense 1', 'Expense 2', 'Expense 3'],
            datasets: [{
                data: [100, 200, 300],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Sales Line Chart
    const salesCtx = document.getElementById('sales-linechart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Total Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#4BC0C0',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});