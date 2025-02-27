import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/StockManagement.css';

const StockManagement = ({ userId }) => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });
  const [editStock, setEditStock] = useState(null);

  useEffect(() => {
    axios.get(`https://inventory-tracker-1fnw.onrender.com/stocks/${userId}`)
      .then((response) => {
        setStocks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stock data', error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editStock) {
      axios.put(`https://inventory-tracker-1fnw.onrender.com/stocks/${editStock._id}`, { ...newStock })
        .then((response) => {
          setStocks(stocks.map(stock => stock._id === editStock._id ? response.data : stock));
          setNewStock({ name: '', category: '', quantity: '', price: '' });
          setEditStock(null);
        })
        .catch((error) => {
          console.error('Error updating stock item', error);
        });
    } else {
      axios.post('https://inventory-tracker-1fnw.onrender.com/stocks', { ...newStock, userId: userId })
        .then((response) => {
          setStocks([...stocks, response.data]);
          setNewStock({ name: '', category: '', quantity: '', price: '' });
        })
        .catch((error) => {
          console.error('Error adding stock item', error);
        });
    }
  };

  const handleDelete = (id) => {
    axios.delete(`https://inventory-tracker-1fnw.onrender.com/stocks/${id}`)
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
      name: stock.name,
      category: stock.category,
      quantity: stock.quantity,
      price: stock.price
    });
  };

  return (
    <div className="stock-management">
      <h2>Stock Management</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={newStock.name} onChange={handleChange} placeholder="Stock Name" required />
        <input type="text" name="category" value={newStock.category} onChange={handleChange} placeholder="Category" required />
        <input type="number" name="quantity" value={newStock.quantity} onChange={handleChange} placeholder="Quantity" required />
        <input type="number" name="price" value={newStock.price} onChange={handleChange} placeholder="Price" required />
        <button type="submit">{editStock ? 'Update Stock' : 'Add Stock'}</button>
      </form>

      <div className="stock-list">
        <h3>Stock Items</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.name}</td>
                <td>{stock.category}</td>
                <td>{stock.quantity}</td>
                <td>Rs.{stock.price}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(stock)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(stock._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
