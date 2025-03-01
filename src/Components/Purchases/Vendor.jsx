import React, { useState } from "react";
import './CSS/Vendor.css';

const Vendor = () => {
  const [vendor, setVendor] = useState({ name: "", contact: "", address: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vendor Details:", vendor);
    setIsSubmitted(true);
  };

  const handleClear = () => {
    setVendor({ name: "", contact: "", address: "" });
    setIsSubmitted(false);
  };

  return (
    <div className="vendor-container">
      <h3>Vendor Details</h3>
      <form className="vendor-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Vendor Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Vendor Name"
            value={vendor.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="contact">Contact Info</label>
          <input
            type="text"
            name="contact"
            id="contact"
            placeholder="Enter Contact Information"
            value={vendor.contact}
            onChange={handleChange}
            required
            pattern="^[0-9]{10}$" // Example pattern for a 10-digit contact number
            title="Please enter a valid 10-digit contact number"
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Enter Vendor Address"
            value={vendor.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Add Vendor</button>
          <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Vendor added successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Vendor;
