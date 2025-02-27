import React, { useState } from 'react';
import './CSS/NavBar.css';
import profileIcon from '../assets/Images/Profile.jpg';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ userName, isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate=useNavigate()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header>
      <h1>Inventory-Tracker</h1>
      {isLoggedIn && (
        <div className="navbar-right">
          <span className="user-name">{userName}</span>
          <img
            src={profileIcon}
            alt="Profile Icon"
            className="profile-icon"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="logout-btn" onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false); 
                  navigate("/")
                }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;
