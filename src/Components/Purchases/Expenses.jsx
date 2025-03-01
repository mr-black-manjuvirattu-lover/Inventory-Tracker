import React, { useState } from "react";
import './CSS/Expenses.css';

const Expenses = () => {
  const [expense, setExpense] = useState({ category: "", amount: "", date: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expense.amount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }
    console.log("Expense Added:", expense);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setExpense({ category: "", amount: "", date: "" });
    setIsSubmitted(false);
  };

  return (
    <div className="expenses-container">
      <h3>Record Expense</h3>
      <form className="expenses-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="category">Expense Category</label>
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Enter category"
            value={expense.category}
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
            placeholder="Enter amount"
            value={expense.amount}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="date">Expense Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={expense.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Add Expense</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Expense added successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Expenses;
