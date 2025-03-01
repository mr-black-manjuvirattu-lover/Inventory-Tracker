import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCustomer from './AddCustomer';
import CustomerList from './CustomerList';
import './CSS/Customer.css'

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/customers/${userId}`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [userId]);

  const addCustomer = (customer) => {
    setCustomers([...customers, customer]);
  };

  return (
    <div className="customer-sections">
      <div className="customer-card">
        <AddCustomer onAdd={addCustomer} />
      </div>
      <div className="customer-card">
        <CustomerList customers={customers} />
      </div>
    </div>
  );
};

export default Customer;
