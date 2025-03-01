import React, { useState } from "react";
import './CSS/PurchaseReceives.css';

const PurchaseReceives = () => {
  const [receive, setReceive] = useState({ orderId: "", dateReceived: "", status: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setReceive({ ...receive, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (receive.status !== "Received" && receive.status !== "Pending") {
      alert("Status must be 'Received' or 'Pending'.");
      return;
    }
    console.log("Purchase Received:", receive);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setReceive({ orderId: "", dateReceived: "", status: "" });
    setIsSubmitted(false);
  };

  return (
    <div className="purchase-receives-container">
      <h3>Purchase Received</h3>
      <form className="purchase-receives-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="orderId">Order ID</label>
          <input
            type="text"
            name="orderId"
            id="orderId"
            placeholder="Enter Order ID"
            value={receive.orderId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="dateReceived">Date Received</label>
          <input
            type="date"
            name="dateReceived"
            id="dateReceived"
            value={receive.dateReceived}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            name="status"
            id="status"
            placeholder="Enter status (Received/Pending)"
            value={receive.status}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Confirm Received</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Purchase received successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default PurchaseReceives;
