import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  }, []);

  const handleStockUpdate = (productId, newQuantity) => {
    axios.put(`http://localhost:3001/products/${productId}`, { quantity: newQuantity })
      .then(() => {
        setProducts(products.map((product) => {
          if (product._id === productId) {
            product.quantity = newQuantity;
          }
          return product;
        }));
      })
      .catch((error) => {
        console.error('Error updating stock', error);
      });
  };

  return (
    <div className="stock-management">
      <h2>Stock Management</h2>
      <div className="product-list">
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              {product.name} - {product.quantity} units
              <input 
                type="number" 
                value={product.quantity} 
                onChange={(e) => handleStockUpdate(product._id, e.target.value)} 
              />
              <button onClick={() => handleStockUpdate(product._id, product.quantity)}>Update Stock</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockManagement;
