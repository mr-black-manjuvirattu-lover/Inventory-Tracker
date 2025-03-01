import React, { useState } from 'react';
import './CSS/SalesReturn.css';

const SalesReturn = () => {
  const [returnData, setReturnData] = useState({ product: '', reason: '', quantity: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setReturnData({ ...returnData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Return Details:', returnData);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setReturnData({ product: '', reason: '', quantity: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="sales-return-container">
      <h2>Product Return</h2>
      <form className="sales-return-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="product">Product</label>
          <input
            type="text"
            name="product"
            id="product"
            placeholder="Enter product name"
            value={returnData.product}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="reason">Reason for Return</label>
          <input
            type="text"
            name="reason"
            id="reason"
            placeholder="Enter reason for return"
            value={returnData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Enter quantity"
            value={returnData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Save Return</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Return request saved successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SalesReturn;
