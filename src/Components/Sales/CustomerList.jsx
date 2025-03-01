import React from 'react';
import './CSS/CustomerList.css';

const CustomerList = ({ customers }) => {
  return (
    <div className="customer-list-container">
      <h2>Existing Customers</h2>
      {customers.length === 0 ? (
        <p>No customers added yet.</p>
      ) : (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
