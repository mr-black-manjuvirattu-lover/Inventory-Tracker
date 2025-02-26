import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Home.css";
import inventoryImage from "../assets/Images/inventory-tracker.jpg"; 

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Inventory Tracker!</h1>
        <p>
          Keep your stock organized, track products in real-time, and manage your inventory effortlessly.  
          Inventory Tracker helps you reduce stock errors, optimize storage, and improve overall efficiency.  
        </p>

        <ul className="features-list">
          <li>✅ Real-time stock updates</li>
          <li>✅ Easy product categorization</li>
          <li>✅ Automated low-stock alerts</li>
          <li>✅ User-friendly dashboard</li>
          <li>✅ Cloud-based access anywhere</li>
        </ul>

        <p>
          Take control of your inventory today and never lose track of your stock again!  
          Sign up now and experience seamless inventory management.
        </p>

        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>

      <div className="home-image">
        <img src={inventoryImage} alt="Inventory Tracking Illustration" />
      </div>
    </div>
  );
};

export default Home;
