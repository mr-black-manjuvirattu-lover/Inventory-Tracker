import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/NavBar.css'
const NavBar = () => {
  return (
    <header>
      <h1>Inventory-Tracker</h1>
      <nav>
        <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up Now</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/stocks">Stock</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
