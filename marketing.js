document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([0, 0], 2); // Initial view is set to the whole world

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Example data points. Replace these with actual customer data.
    var customers = [
        {lat: 51.505, lon: -0.09, count: 10, country: 'United Kingdom'},
        {lat: 40.7128, lon: -74.0060, count: 5, country: 'United States'},
        {lat: 34.0522, lon: -118.2437, count: 8, country: 'United States'},
        {lat: 35.6895, lon: 139.6917, count: 15, country: 'Japan'},
        {lat: -1.286389, lon: 36.817223, count: 30, country: 'Kenya'} 
    ];

    var legend = document.getElementById('legend');
    var colors = ['green', 'yellow', 'red'];

    customers.forEach(function(customer) {
        var color;
        if (customer.count > 10) {
            color = colors[2]; // red
        } else if (customer.count > 5) {
            color = colors[1]; // yellow
        } else {
            color = colors[0]; // green
        }

        L.circle([customer.lat, customer.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: customer.count * 10000
        }).addTo(map).bindPopup("Country: " + customer.country + "<br>Customer count: " + customer.count);

        var legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        var legendColor = document.createElement('div');
        legendColor.className = 'legend-color';
        legendColor.style.backgroundColor = color;

        var legendText = document.createElement('span');
        legendText.innerText = "Country: " + customer.country + " - Customer count: " + customer.count;

        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendText);
        legend.appendChild(legendItem);
    });
});
