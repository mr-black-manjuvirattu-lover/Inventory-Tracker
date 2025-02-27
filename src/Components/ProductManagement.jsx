import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/ProductManagement.css';

const ProductManagement = ({ userId }) => {  
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = () => {
    axios.get(`https://inventory-tracker-1fnw.onrender.com/${userId}`)
      .then((response) => {
        console.log("Products fetched:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://inventory-tracker-1fnw.onrender.com/products', { ...newProduct, userId: userId })
      .then((response) => {
        console.log("Added Product:", response.data);
        setNewProduct({ name: '', category: '', price: '', quantity: '' });

        fetchProducts();
      })
      .catch((error) => {
        console.error('Error adding product', error);
      });
};

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Product Name" required />
        <input type="text" name="category" value={newProduct.category} onChange={handleChange} placeholder="Category" required />
        <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Price" required />
        <input type="number" name="quantity" value={newProduct.quantity} onChange={handleChange} placeholder="Quantity" required />
        <button type="submit">Add Product</button>
      </form>

      <div className="product-list">
        <h3>Product List</h3>
        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product._id}>
                {product.name} - {product.category} - Rs.{product.price} - {product.quantity} units
              </li>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
