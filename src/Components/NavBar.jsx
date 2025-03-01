import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/Images/Profile.jpg';
import './CSS/NavBar.css';

const NavBar = ({ userName, isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Inventory Tracker</h1>
      </div>

      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/sales">Sales</Link></li>
          <li><Link to="/purchases">Purchase</Link></li>
          <li><Link to="/report">Report</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {isLoggedIn && (
          <div className="profile-section">
            <span className="user-name">{userName}</span>
            <img
              src={profileIcon}
              alt="Profile Icon"
              className="profile-icon"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button
                  className="logout-btn"
                  onClick={() => {
                    onLogout();
                    setIsDropdownOpen(false);
                    navigate('/');
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
