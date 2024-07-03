// customers.js

function searchCustomers() {
    const searchValue = document.getElementById('searchInput').value.trim();
    
    // Example: Fetching data from MongoDB (replace with your backend endpoint)
    axios.get(`/api/customers?search=${searchValue}`)
        .then(response => {
            displayCustomers(response.data); // Assuming response.data is an array of customers
        })
        .catch(error => {
            console.error('Error fetching customer data:', error);
        });
}

function displayCustomers(customers) {
    const tableBody = document.querySelector('#customersTable tbody');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.balance}</td>
            <td>${customer.credit}</td>
            <td>${customer.area}</td>
        `;
        tableBody.appendChild(row);
    });
}
