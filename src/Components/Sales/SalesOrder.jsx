import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/SalesOrder.css'

const SalesOrder = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [order, setOrder] = useState({
    customer: '',
    customerId: '',
    product: '',
    productId: '',
    stockId: '',
    quantity: '',
    price: '',
    totalPrice: 0,
    returnDate: '',
    status: 'Pending',
    stockError: ''
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
  
    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:5001/customers/${userId}`),
      axios.get(`http://localhost:5001/stocks/${userId}`),
      axios.get(`http://localhost:5001/salesorder/${userId}`)
    ])
      .then(([customersRes, productsRes, salesOrdersRes]) => {
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
        setSalesOrders(salesOrdersRes.data);
      })
      .catch(err => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, [userId]);
  

  const handleCustomerChange = (e) => {
    setOrder({
      ...order,
      customer: e.target.value
    });
  };

  const handleProductChange = (e) => {
    const selectedStockId = e.target.value;
    const selected = products.find(prod => prod._id === selectedStockId);

    setSelectedProduct(selected);

    setOrder({
      ...order,
      product: selected?.productName || '',
      productId: selected?.productId || '',
      stockId: selected?._id || '',
      price: selected?.price || 0,
      quantity: '',
      totalPrice: 0,
      stockError: ''
    });
  };

  const handleQuantityChange = (e) => {
    const qty = Number(e.target.value); 
    const availableQty = Number(selectedProduct?.quantity || 0);
  
    if (!selectedProduct) {
      setOrder({ ...order, stockError: 'Please select a product first.' });
      return;
    }
  
    if (qty > availableQty) {
      setOrder({
        ...order,
        quantity: qty,
        totalPrice: qty * order.price,
        stockError: 'Quantity exceeds available stock'
      });
    } else {
      setOrder({
        ...order,
        quantity: qty,
        totalPrice: qty * order.price,
        stockError: ''
      });
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCustomer = customers.find(cust => cust.name === order.customer);

    if (!selectedCustomer) {
      console.error('Customer not found!');
      return;
    }

    if (!selectedProduct || !selectedProduct._id) {
      console.error('Product or Stock not found!');
      return;
    }

    if (order.stockError) {
      console.error('Cannot proceed due to stock error!');
      return;
    }

    const currentDateTime = new Date().toISOString().slice(0, 16);

    const newOrder = {
      userId,
      customerId: selectedCustomer._id,
      customer: selectedCustomer.name,
      productId: selectedProduct.productId,
      product: selectedProduct.productName,
      stockId: selectedProduct._id,
      quantity: order.quantity,
      price: order.price,
      totalPrice: order.totalPrice,
      returnDate: order.returnDate,
      orderDate: currentDateTime,
      status: order.status
    };
    
    console.log('Submitting Order:', newOrder);
    axios.post(`http://localhost:5001/salesorder/${userId}`, newOrder)
  .then(response => {
    console.log('Sales Order Created:', response.data);
    axios.get(`http://localhost:5001/salesorder/${userId}`)
      .then(res => {
        setSalesOrders(res.data);
      })
      .catch(err => console.error('Error fetching updated sales orders:', err));
    axios.get(`http://localhost:5001/stocks/${userId}`)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error('Error fetching updated stocks:', err));

    resetOrderForm();
  })
  .catch(err => console.error('Error creating sales order:', err));
};

  const resetOrderForm = () => {
    setOrder({
      customer: '',
      customerId: '',
      product: '',
      productId: '',
      stockId: '',
      quantity: '',
      price: '',
      totalPrice: 0,
      returnDate: '',
      status: 'Pending',
      stockError: ''
    });
    setSelectedProduct(null);
  };

  return (
    <div className='sales-order-wrapper'>
      {loading && <p>Loading data...</p>}
      <div className="sales-order-container">
        <h2>Sales Order</h2>
        <form onSubmit={handleSubmit} className="sales-order-form">
          <div className="form-group">
            <label htmlFor="customer">Customer:</label>
            <select
              id="customer"
              name="customer"
              value={order.customer}
              onChange={handleCustomerChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(cust => (
                <option key={cust._id} value={cust.name}>
                  {cust.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product">Product:</label>
            <select
              id="product"
              name="product"
              value={order.stockId}
              onChange={handleProductChange}
              required
            >
              <option value="">Select Product</option>
              {products.map(prod => (
                <option key={prod._id} value={prod._id}>
                  {prod.productName}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="product-details">
              <p><strong>Available Stock:</strong> {selectedProduct.quantity}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={order.quantity}
              onChange={handleQuantityChange}
              min="1"
              required
            />
          </div>

          {order.stockError && (
            <p className="error-message">{order.stockError}</p>
          )}

          <div className="form-group">
            <label htmlFor="totalPrice">Total Price:</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={order.totalPrice}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="returnDate">Return Date :</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={order.returnDate}
              onChange={(e) => setOrder({ ...order, returnDate: e.target.value })}
              required
            />
          </div>

          <button type="submit">Create Sales Order</button>
        </form>

        <h3>Existing Sales Orders</h3>
        <div className="sales-order-container">
          <table className="sales-orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.map((order, index) => (
                <tr key={order._id || `order-${index}`}>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.returnDate}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>
    </div>
    
  );
};

export default SalesOrder;
