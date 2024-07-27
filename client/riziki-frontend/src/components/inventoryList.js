// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './InventoryList.css'; // Import your CSS file
import { FiArrowLeft } from 'react-icons/fi'; // Import Icon from react-icons (Feather Icons)

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('https://riziki-backend-ft22.onrender.com/api/inventory');
        setInventory(response.data.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="container">
      <h2>Inventory</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin" className="back-button">
        <FiArrowLeft className="back-icon" />
        Return to Admin Dashboard
      </Link>
    </div>
  );
};

export default InventoryList;
