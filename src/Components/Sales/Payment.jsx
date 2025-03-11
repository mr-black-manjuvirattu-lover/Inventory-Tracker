import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // import this
import './CSS/Payment.css';

const Payment = () => {
  const location = useLocation();
  const { totalPrice } = location.state || { totalPrice: 0 };

  const [payment, setPayment] = useState({
    amount: totalPrice, // initialize with the passed amount
    method: '',
    date: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment Details:', payment);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setPayment({ amount: totalPrice, method: '', date: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="payment-container">
      <h2>Record Payment</h2>
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Enter amount"
            value={payment.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="method">Payment Method</label>
          <input
            type="text"
            name="method"
            id="method"
            placeholder="Enter payment method"
            value={payment.method}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={payment.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Save Payment</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Payment recorded successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Payment;
