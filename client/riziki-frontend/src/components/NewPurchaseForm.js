import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NewPurchaseForm = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [batchQuantity, setBatchQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [batchPricePerKg, setBatchPricePerKg] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [unitSize, setUnitSize] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [daysBack, setDaysBack] = useState(1); // Default to 1 day back

  const fetchData = useCallback(async () => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - daysBack); // Start from today - daysBack
      const endDate = new Date(today);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const response = await axios.get(`http://localhost:8000/api/inventory/batches-by-date-range?startDate=${startDateStr}&endDate=${endDateStr}`);
      setPurchases(response.data.data); // Ensure the data is set correctly
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  }, [daysBack]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/inventory', {
        name: productName,
        category: productCategory,
        batchQuantity: parseInt(batchQuantity),
        supplier,
        batchPricePerKg: parseInt(batchPricePerKg),
        purchaseDate,
        unitSize: parseInt(unitSize)
      });
      console.log('Purchase submitted successfully:', response.data);
      // Optionally, update state or fetch new data
      setProductName('');
      setProductCategory('');
      setBatchQuantity('');
      setSupplier('');
      setBatchPricePerKg('');
      setPurchaseDate('');
      setUnitSize('');
      fetchData(); // Refresh the purchases table after adding a new purchase
    } catch (error) {
      console.error('Error submitting purchase:', error);
    }
  };

  const handleDaysBackChange = (e) => {
    setDaysBack(Number(e.target.value));
  };

  return (
    <div>
      <h2>New Purchase Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <label htmlFor="productCategory">Product Category:</label>
        <input
          type="text"
          id="productCategory"
          name="productCategory"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
        />

        <label htmlFor="batchQuantity">Batch Quantity:</label>
        <input
          type="number"
          id="batchQuantity"
          name="batchQuantity"
          value={batchQuantity}
          onChange={(e) => setBatchQuantity(e.target.value)}
          required
        />

        <label htmlFor="supplier">Supplier:</label>
        <input
          type="text"
          id="supplier"
          name="supplier"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          required
        />

        <label htmlFor="batchPricePerKg">Batch Price Per Kg:</label>
        <input
          type="number"
          id="batchPricePerKg"
          name="batchPricePerKg"
          value={batchPricePerKg}
          onChange={(e) => setBatchPricePerKg(e.target.value)}
          required
        />

        <label htmlFor="purchaseDate">Purchase Date:</label>
        <input
          type="date"
          id="purchaseDate"
          name="purchaseDate"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          required
        />

        <label htmlFor="unitSize">Unit Size:</label>
        <input
          type="number"
          id="unitSize"
          name="unitSize"
          value={unitSize}
          onChange={(e) => setUnitSize(e.target.value)}
          required
        />

        <button type="submit">Submit Purchase</button>
      </form>

      <h3>Filter Purchases</h3>
      <label htmlFor="daysBackSelect">Days Back:</label>
      <select id="daysBackSelect" value={daysBack} onChange={handleDaysBackChange}>
        <option value={1}>Today</option>
        <option value={7}>7 days</option>
        <option value={14}>14 days</option>
        <option value={30}>30 days</option>
      </select>

      <h3>Purchases Table</h3>
      {Array.isArray(purchases) && purchases.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price Per Kg</th>
              <th>Unit Size</th>
              <th>Total Price</th>
              <th>Batch ID</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.batchId}>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>{purchase.supplier}</td>
                <td>{purchase.inventoryItem}</td>
                <td>{purchase.category}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.pricePerKg}</td>
                <td>{purchase.unitSize}</td>
                <td>{purchase.quantity * purchase.unitSize * purchase.pricePerKg}</td> {/* Updated calculation */}
                <td>{purchase.batchId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No purchases found for the selected period.</p>
      )}
    </div>
  );
};

export default NewPurchaseForm;
