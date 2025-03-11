import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/SalesReturn.css';

const SalesReturn = () => {
  const userId = localStorage.getItem('userId');

  const [customers, setCustomers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
  const [selectedProductOrders, setSelectedProductOrders] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [returnData, setReturnData] = useState({
    customerId: '',
    customer: '',
    productId: '',
    product: '',
    salesOrderId: '',
    feedback: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, orderRes] = await Promise.all([
          axios.get(`http://localhost:5001/customers/${userId}`),
          axios.get(`http://localhost:5001/salesorder/${userId}`)
        ]);

        const allCustomers = custRes.data;
        const allSalesOrders = orderRes.data;

        setSalesOrders(allSalesOrders);

        const customerIdsWithOrders = [...new Set(allSalesOrders.map(order => order.customerId))];
        const filteredCustomers = allCustomers.filter(cust => customerIdsWithOrders.includes(cust._id));

        setCustomers(filteredCustomers);
      } catch (error) {
        console.error('Error fetching customers or sales orders:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    const selectedCustomer = customers.find(cust => cust._id === selectedCustomerId);

    const customerOrders = salesOrders.filter(order => order.customerId === selectedCustomerId);

    const customerProductsMap = {};
    customerOrders.forEach(order => {
      if (!customerProductsMap[order.productId]) {
        customerProductsMap[order.productId] = {
          productId: order.productId,
          productName: order.product,
          stockId: order.stockId
        };
      }
    });

    const customerProducts = Object.values(customerProductsMap);

    setSelectedCustomerOrders(customerOrders);

    setReturnData({
      customerId: selectedCustomerId,
      customer: selectedCustomer ? selectedCustomer.name : '',
      productId: '',
      product: '',
      salesOrderId: '',
      feedback: ''
    });

    setProducts(customerProducts);
    setSelectedProductOrders([]);
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(prod => prod.productId === selectedProductId);

    if (!selectedProduct) return;

    const productOrders = selectedCustomerOrders.filter(order => order.productId === selectedProductId && order.status !== 'Returned');

    setSelectedProductOrders(productOrders);

    setReturnData(prev => ({
      ...prev,
      productId: selectedProductId,
      product: selectedProduct.productName,
      salesOrderId: '',
      feedback: ''
    }));
  };

  const handleOrderChange = (e) => {
    const selectedOrderId = e.target.value;
    const selectedOrder = selectedProductOrders.find(order => order._id === selectedOrderId);

    if (!selectedOrder) return;

    setReturnData(prev => ({
      ...prev,
      salesOrderId: selectedOrderId
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setReturnData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!returnData.salesOrderId) {
      alert("Please select a sales order to return from.");
      return;
    }
  
    console.log("selectedProductOrders:", selectedProductOrders);
  
    if (!selectedProductOrders || selectedProductOrders.length === 0) {
      console.error('No sales orders available!');
      alert("No sales orders found.");
      return;
    }
  
    try {
      const selectedOrder = selectedProductOrders?.find(order => order._id === returnData.salesOrderId);
  
      if (!selectedOrder) {
        console.error('Sales order not found!');
        return;
      }
  
      console.log("Selected Order:", selectedOrder);
  
      if (selectedOrder.productId !== returnData.productId) {
        console.error('Product not found in the order!');
        alert("The selected product does not exist in this order.");
        return;
      }
  
      const productQuantity = selectedOrder.quantity;
  
      if (isNaN(productQuantity) || productQuantity <= 0) {
        alert("Invalid quantity. Cannot process the return.");
        return;
      }
  
      const response = await axios.post(`http://localhost:5001/salesreturn/${userId}`, {
        ...returnData,
        userId,
        quantity: productQuantity
      });
  
      console.log('Return Saved:', response.data);
  
      const productToUpdate = products.find(prod => prod.productId === returnData.productId);
  
      if (!productToUpdate || !productToUpdate.stockId) {
        console.error('Product not found or stockId missing!');
        return;
      }
  
      await axios.put(`http://localhost:5001/updatestock/${userId}`, {
        stockId: productToUpdate.stockId,
        quantity: productQuantity
      });
  
      console.log('Stock updated:', productToUpdate.stockId, productQuantity);
  
      const updateOrderRes = await axios.put(`http://localhost:5001/updatesalesorder/${selectedOrder._id}`, {
        status: 'Returned'
      });
  
      console.log('Sales order updated:', updateOrderRes.data);
  
      handleClear();
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error processing return:', error);
    }
  };
  
  const handleClear = () => {
    setReturnData({
      customerId: '',
      customer: '',
      productId: '',
      product: '',
      salesOrderId: '',
      feedback: ''
    });

    setProducts([]);
    setSelectedCustomerOrders([]);
    setSelectedProductOrders([]);
    setIsSubmitted(false);
  };

  return (
    <div className="sales-return-container">
      <h2>Product Return</h2>

      <form className="sales-return-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="customer">Customer</label>
          <select
            id="customer"
            name="customerId"
            value={returnData.customerId}
            onChange={handleCustomerChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(cust => (
              <option key={cust._id} value={cust._id}>
                {cust.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="product">Product</label>
          <select
            id="product"
            name="productId"
            value={returnData.productId}
            onChange={handleProductChange}
            required
            disabled={!returnData.customerId}
          >
            <option value="">Select Product</option>
            {products.map(prod => (
              <option key={prod.productId} value={prod.productId}>
                {prod.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="salesOrder">Sales Order</label>
          <select
            id="salesOrder"
            name="salesOrderId"
            value={returnData.salesOrderId}
            onChange={handleOrderChange}
            required
            disabled={!returnData.productId}
          >
            <option value="">Select Sales Order</option>
            {selectedProductOrders.map(order => (
              <option key={order._id} value={order._id}>
                {`Order Date: ${new Date(order.orderDate).toLocaleDateString()} | Qty: ${order.quantity}`}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="Feedback">Feedback</label>
          <textarea
            name="feedback"
            id="Feedback"
            placeholder="Enter your feedback about the product"
            value={returnData.feedback}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="submit-btn"
            disabled={!returnData.salesOrderId}
          >
            Save Return
          </button>
          <button type="button" className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>

        {isSubmitted && (
          <div className="confirmation-message">
            <p>Return request saved and sales order updated!</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SalesReturn;
