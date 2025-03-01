import React, { useState } from 'react';
import './CSS/Shipment.css';

const Shipment = () => {
  const [shipment, setShipment] = useState({
    trackingId: '',
    courier: '',
    status: '',
    shipmentDate: '',
  });

  const couriers = ['DHL', 'FedEx', 'UPS', 'Blue Dart', 'USPS'];
  const statuses = ['Pending', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];

  const generateTrackingId = () => {
    return 'TRK' + Math.floor(Math.random() * 1000000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipment({ ...shipment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Shipment Details:', shipment);
  };

  return (
    <div className="shipment-container">
      <h2>Shipment Details</h2>
      <form onSubmit={handleSubmit} className="shipment-form">
        <input
          type="text"
          name="trackingId"
          placeholder="Tracking ID"
          value={shipment.trackingId || generateTrackingId()}
          readOnly
        />

        <select name="courier" value={shipment.courier} onChange={handleChange} required>
          <option value="">Select Courier Service</option>
          {couriers.map((courier, index) => (
            <option key={index} value={courier}>{courier}</option>
          ))}
        </select>

        <select name="status" value={shipment.status} onChange={handleChange} required>
          <option value="">Select Shipment Status</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>

        <input type="date" name="shipmentDate" value={shipment.shipmentDate} onChange={handleChange} required />

        <button type="submit">Save Shipment</button>
      </form>
    </div>
  );
};

export default Shipment;
