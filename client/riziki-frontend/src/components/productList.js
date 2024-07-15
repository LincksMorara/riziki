import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('/api/inventory');
        setInventory(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Inventory List</h1>
      <ul>
        {inventory.map(item => (
          <li key={item._id}>
            {item.name} ({item.category}) - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;