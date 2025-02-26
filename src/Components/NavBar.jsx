import React from 'react';
import './CSS/NavBar.css';

const NavBar = ({ userName, isLoggedIn }) => {
  const profileIcon = 'https://via.placeholder.com/30'; 

  return (
    <header>
      <h1>Inventory-Tracker</h1>
      {isLoggedIn && (
        <div className="navbar-right">
          <span className="user-name">{userName}</span>
          <img src={profileIcon} alt="Profile Icon" className="profile-icon" />
        </div>
      )}
    </header>
  );
};

export default NavBar;
