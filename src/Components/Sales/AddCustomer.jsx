import React, { useState } from 'react';
import axios from 'axios';
import './CSS/AddCustomer.css'
const AddCustomer = ({ onAdd }) => {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const userId = localStorage.getItem('userId');

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/customers', {
        userId,
        ...customer
      });
      onAdd(response.data);
      setCustomer({
        name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="add-customer-container">
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={customer.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={customer.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone" value={customer.phone} onChange={handleChange} required />
        <button type="submit">Save Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
