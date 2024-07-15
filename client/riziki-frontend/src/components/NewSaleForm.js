import React, { useState } from 'react';
import axios from 'axios';

const NewSaleForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    category: '',
    quantity: 0,
    sellingPrice: 0,
    buyer: '',
    saleDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/sales', formData);
      console.log('New sale added:', response.data);
      // Optionally update state or show a success message
    } catch (error) {
      console.error('Error adding new sale:', error);
      // Handle error state or show error message
    }
  };

  return (
    <div>
      <h3>New Sale Form</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Product Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Category:
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </label>
        <br />
        <label>
          Quantity:
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </label>
        <br />
        <label>
          Selling Price:
          <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} />
        </label>
        <br />
        <label>
          Buyer:
          <input type="text" name="buyer" value={formData.buyer} onChange={handleChange} />
        </label>
        <br />
        <label>
          Sale Date:
          <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Add Sale</button>
      </form>
    </div>
  );
}

export default NewSaleForm;