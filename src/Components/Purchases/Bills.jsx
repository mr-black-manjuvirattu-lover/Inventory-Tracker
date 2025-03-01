import React, { useState } from "react";
import './CSS/Bills.css';

const Bills = () => {
  const [bill, setBill] = useState({ billNumber: "", amount: "", dueDate: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bill.amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }
    console.log("Bill Created:", bill);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setBill({ billNumber: "", amount: "", dueDate: "" });
    setIsSubmitted(false);
  };

  return (
    <div className="bills-container">
      <h3>Manage Bills</h3>
      <form className="bills-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="billNumber">Bill Number</label>
          <input
            type="text"
            name="billNumber"
            id="billNumber"
            placeholder="Enter Bill Number"
            value={bill.billNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Enter Amount"
            value={bill.amount}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={bill.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Add Bill</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Bill created successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Bills;
