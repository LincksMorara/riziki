import React, { useState, useEffect } from 'react';

const NewSaleForm = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user'))); // Retrieve user from localStorage
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    sellingPrice: '',
    buyer: '',
    saleDate: ''
  });
  const [inventory, setInventory] = useState([]); // State for inventory data
  const [submitting, setSubmitting] = useState(false); // State to track form submission
  const [saleResponse, setSaleResponse] = useState(null); // State to store sale response

  useEffect(() => {
    // Fetch inventory data from API endpoint
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    fetch('http://localhost:8000/api/inventory')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setInventory(data.data); // Update inventory state with fetched data
        } else {
          console.error('Failed to fetch inventory data');
        }
      })
      .catch(error => {
        console.error('Error fetching inventory data:', error);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    fetch('http://localhost:8000/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username, // Use stored username from localStorage
        ...formData
      })
    })
      .then(response => response.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setSaleResponse({
            ...data.data,
            inventoryItem: {
              name: formData.name,    // Use form data for product name
              category: formData.category  // Use form data for category
            }
          }); // Store the sale response with form data
        } else {
          alert('Failed to record sale');
        }
      })
      .catch(error => {
        setSubmitting(false);
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const handleMakeAnotherSale = () => {
    setSaleResponse(null); // Reset sale response to allow another sale
    setFormData({
      name: '',
      category: '',
      quantity: '',
      sellingPrice: '',
      buyer: '',
      saleDate: ''
    });
  };

  return (
    <div>
      {user && <p>Welcome, {user.username}</p>}
      {saleResponse ? (
        <div className="receipt">
          <h2>Sale Receipt</h2>
          <p>Product Name: {saleResponse.inventoryItem.name}</p>
          <p>Category: {saleResponse.inventoryItem.category}</p>
          <p>Quantity: {saleResponse.quantity}</p>
          <p>Selling Price: {saleResponse.price}</p>
          <p>Buyer: {saleResponse.buyer}</p>
          <p>Sale Date: {saleResponse.date}</p>
          <p>Profit: {saleResponse.profit}</p>
          <button onClick={handleMakeAnotherSale}>Make Another Sale</button>
          {/* Conditional button based on user role */}
          <button onClick={() => {
            // Redirect based on user role
            if (user.role === 'admin') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/user'; // Redirect to user dashboard
            }
          }}>
            {user.role === 'admin' ? 'Go Back to Admin Dashboard' : 'Go Back to User Dashboard'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product Name:</label>
            <select name="name" value={formData.name} onChange={handleChange} required>
              <option value="">Select Product Name</option>
              {inventory.map(item => (
                <option key={item._id} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {inventory.map(item => (
                <option key={item._id} value={item.category}>{item.category}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantity:</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </div>
          <div>
            <label>Selling Price:</label>
            <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required />
          </div>
          <div>
            <label>Buyer:</label>
            <input type="text" name="buyer" value={formData.buyer} onChange={handleChange} required />
          </div>
          <div>
            <label>Sale Date:</label>
            <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={submitting}>Submit</button>
        </form>
      )}
    </div>
  );
};

export default NewSaleForm;
