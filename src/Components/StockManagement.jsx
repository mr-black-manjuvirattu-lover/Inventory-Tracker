import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/StockManagement.css';

const StockManagement = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState({
    productId: '',
    quantity: '',
  });
  const [editStock, setEditStock] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5001/products/${userId}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products', error);
      });

    axios.get(`http://localhost:5001/stocks/${userId}`)
      .then((response) => {
        setStocks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stock data', error);
      });
  }, [userId]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selected = products.find(p => p._id === productId);
    setSelectedProduct(selected);
    setNewStock({
      ...newStock,
      productId: productId,
      quantity: '',
    });
  };

  const handleQuantityChange = (e) => {
    setNewStock({ ...newStock, quantity: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editStock) {
      axios.put(`http://localhost:5001/stocks/${editStock._id}`, { ...newStock })
        .then((response) => {
          setStocks(stocks.map(stock => stock._id === editStock._id ? response.data : stock));
          setNewStock({ productId: '', quantity: '' });
          setEditStock(null);
          setSelectedProduct(null);
        })
        .catch((error) => {
          console.error('Error updating stock item', error);
        });
    } else {
      axios.post('http://localhost:5001/stocks', { ...newStock, userId: userId })
        .then((response) => {
          setStocks([...stocks, response.data]);
          setNewStock({ productId: '', quantity: '' });
          setSelectedProduct(null);
        })
        .catch((error) => {
          console.error('Error adding stock item', error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/stocks/${id}`)
      .then(() => {
        setStocks(stocks.filter(stock => stock._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting stock item', error);
      });
  };

  const handleEdit = (stock) => {
    setEditStock(stock);
    setNewStock({
      productId: stock.productId,
      quantity: stock.quantity,
    });
    setSelectedProduct(products.find(p => p._id === stock.productId));
  };

  return (
    <div className="stock-management">
      <h2>Stock Management</h2>

      <form onSubmit={handleSubmit}>
        <select name="productId" value={newStock.productId} onChange={handleProductChange} required>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        {selectedProduct && (
          <>
            <input type="text" value={selectedProduct.price} readOnly placeholder="Price" />
          </>
        )}

        <input type="number" name="quantity" value={newStock.quantity} onChange={handleQuantityChange} placeholder="Stock Quantity" required />
        <button type="submit">{editStock ? 'Update Stock' : 'Add Stock'}</button>
      </form>

      <div className="stock-list">
        <h3>Stock Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const product = products.find(p => p._id === stock.productId);
              return (
                <tr key={stock._id}>
                  <td>{product ? product.name : 'Unknown'}</td>
                  <td>{product ? product.category : 'Unknown'}</td>
                  <td>{stock.quantity}</td>
                  <td>Rs.{product ? product.price : 'N/A'}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(stock)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(stock._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
