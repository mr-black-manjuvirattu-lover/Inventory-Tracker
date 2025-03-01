import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/SalesOrder.css';

const SalesOrder = () => {
  const userId = localStorage.getItem('userId');

  const [order, setOrder] = useState({
    customer: '',
    product: '',
    quantity: '',
    price: '',
    totalPrice: 0,
    orderDate: new Date().toISOString().slice(0, 16),
    returnDate: '',
    status: 'Pending',
    stockError: ''
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    axios.get(`http://localhost:5001/customers/${userId}`)
      .then(response => setCustomers(response.data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5001/stocks/${userId}`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5001/salesorder/${userId}`)
      .then(response => setSalesOrders(response.data))
      .catch(error => console.error('Error fetching sales orders:', error));
  }, []);

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value; 
    const selected = products.find(prod => prod.productId === selectedProductId);
  
    setSelectedProduct(selected);
  
    setOrder({
      ...order,
      product: selected?.productId || '',  
      price: selected?.price || 0,
      quantity: '',
      totalPrice: 0,
      stockError: ''
    });
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedOrder = { ...order, [name]: value };

    if (name === 'quantity') {
      const quantity = parseInt(value, 10) || 0;

      if (selectedProduct) {
        if (quantity > selectedProduct.quantity) {
          updatedOrder.stockError = `Out of stock! Only ${selectedProduct.quantity} available`;
        } else {
          updatedOrder.stockError = '';
          updatedOrder.totalPrice = quantity * selectedProduct.price || 0;
        }
      }
    }

    setOrder(updatedOrder);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Find the customer ID from the selected customer name
    const selectedCustomer = customers.find(cust => cust.name === order.customer);
  
    if (!selectedCustomer) {
      console.error('Customer not found!');
      return;
    }
  
    const currentDateTime = new Date().toISOString().slice(0, 16);
  
    const newOrder = {
      ...order,
      userId,
      customerId: selectedCustomer._id, // Add customerId here
      orderDate: currentDateTime,
      productId: selectedProduct?.productId,
      stockId: selectedProduct?.stockId,
    };
  
    axios.post('http://localhost:5001/salesorder', newOrder)
      .then(response => {
        setSalesOrders([...salesOrders, response.data]);
        setOrder({
          customer: '',
          product: '',
          quantity: '',
          price: '',
          totalPrice: 0,
          returnDate: '',
          status: 'Pending',
          stockError: ''
        });
      })
      .catch(error => console.error('Error creating sales order:', error));
  };
  
  
  return (
    <div className="sales-order-wrapper">
      <div className="sales-order-container">
        <h2>Create Sales Order</h2>
        <form onSubmit={handleSubmit} className="sales-order-form">
          <label htmlFor="customer">Customer:</label>
          <select id="customer" name="customer" value={order.customer} onChange={handleChange} required>
            <option value="">Select Customer</option>
            {customers.map(cust => (
              <option key={cust._id} value={cust.name}>{cust.name}</option>
            ))}
          </select>

          <label htmlFor="product">Product:</label>
          <select
            id="product"
            name="product"
            value={order.product}
            onChange={handleProductChange}
            required
          >
            <option value="">Select Product</option>
            {products.map(prod => (
              <option key={prod.productId} value={prod.productId}>
                {prod.productName}
              </option>
            ))}
          </select>


          {selectedProduct && (
            <p className="product-info">
              Product Price: Rs.{selectedProduct.price} | 
              <span style={{ color: order.stockError ? 'red' : 'black' }}>
                Stock: {selectedProduct.quantity}
              </span>
            </p>
          )}

          <label htmlFor="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" placeholder="Quantity" value={order.quantity} onChange={handleChange} required />
          {order.stockError && <p style={{ color: 'red' }}>{order.stockError}</p>}

          <label htmlFor="price">Price per Unit:</label>
          <input type="number" id="price" name="price" placeholder="Price per Unit" value={order.price} readOnly />

          <label htmlFor="returnDate">Return Date:</label>
          <input type="datetime-local" id="returnDate" name="returnDate" value={order.returnDate} onChange={handleChange} required />

          <p className="total-price">Total Price: <strong>Rs.{order.totalPrice}</strong></p>

          <button type="submit" disabled={!!order.stockError}>Save Order</button>
        </form>
      </div>

      <div className="sales-orders-container">
        <h3>Sales Orders</h3>
        <table className="sales-orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Order Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>Rs.{order.totalPrice}</td>
                <td>{order.orderDate}</td>
                <td>{order.returnDate}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default SalesOrder;
