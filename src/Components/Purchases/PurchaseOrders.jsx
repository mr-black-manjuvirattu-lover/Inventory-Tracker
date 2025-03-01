import React, { useState } from "react";
import './CSS/PurchaseOrders.css';

const PurchaseOrders = () => {
  const [order, setOrder] = useState({ product: "", quantity: "", vendor: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (order.quantity <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }
    console.log("Purchase Order Created:", order);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setOrder({ product: "", quantity: "", vendor: "" });
    setIsSubmitted(false);
  };

  return (
    <div className="purchase-orders-container">
      <h3>Create Purchase Order</h3>
      <form className="purchase-orders-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="product">Product Name</label>
          <input
            type="text"
            name="product"
            id="product"
            placeholder="Enter product name"
            value={order.product}
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
            value={order.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="vendor">Vendor Name</label>
          <input
            type="text"
            name="vendor"
            id="vendor"
            placeholder="Enter vendor name"
            value={order.vendor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Create Order</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Purchase order created successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PurchaseOrders;
