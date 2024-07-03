// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // Code to fetch initial data or set up event listeners
    // Example: Fetching dashboard data
    fetchDashboardData();
});

function fetchDashboardData() {
    // Example of fetching data from backend API
    fetch('/api/dashboard')
        .then(response => response.json())
        .then(data => {
            // Process data and update dashboard UI
            console.log('Dashboard data:', data);
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
}
