import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/ProductManagement.css';

const ProductManagement = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = () => {
    axios.get(`http://localhost:5001/products/${userId}`)
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
    axios.post('http://localhost:5001/products', { ...newProduct, userId: userId })
      .then((response) => {
        console.log("Added Product:", response.data);
        setNewProduct({ name: '', category: '', price: ''});
        fetchProducts();
      })
      .catch((error) => {
        console.error('Error adding product', error);
      });
  };

  const handleDelete = (productId) => {
    axios.delete(`http://localhost:5001/products/${productId}`)
      .then((response) => {
        console.log("Deleted Product:", response.data);
        fetchProducts(); 
      })
      .catch((error) => {
        console.error('Error deleting product', error);
      });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5001/products/${editingProduct._id}`, { ...newProduct })
      .then((response) => {
        console.log("Updated Product:", response.data);
        setIsEditing(false);
        setEditingProduct(null);
        setNewProduct({ name: '', category: '', price: '' });
        fetchProducts();
      })
      .catch((error) => {
        console.error('Error updating product', error);
      });
  };  

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          name="category"
          value={newProduct.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>

      <div className="product-list">
        <h3>Product List</h3>
        <ul>
          {products.length > 0 ? (
            products.map((product) => (
              <li key={product._id}>
                {product.name} - {product.category} - Rs.{product.price}
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
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
