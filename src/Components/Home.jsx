import React from 'react';
import './CSS/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Inventory Tracker!</h1>
      <p>Your one-stop solution for tracking and managing your inventory.</p>
      <button className="get-started-button">Get Started</button>
    </div>
  );
};

export default Home;
