import React from 'react';

const NewPurchaseForm = () => {
  // Placeholder logic
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    console.log('Submitting new purchase form...');
  };

  return (
    <div>
      <h2>New Purchase Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Product Name:</label>
        <input type="text" id="productName" name="productName" required />

        <label htmlFor="purchaseQuantity">Quantity:</label>
        <input type="number" id="purchaseQuantity" name="purchaseQuantity" required />

        <label htmlFor="purchasePrice">Price per Unit:</label>
        <input type="number" id="purchasePrice" name="purchasePrice" required />

        <button type="submit">Submit Purchase</button>
      </form>
    </div>
  );
};

export default NewPurchaseForm;
