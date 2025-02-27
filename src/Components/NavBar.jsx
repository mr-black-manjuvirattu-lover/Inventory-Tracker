import React from 'react';
import './CSS/NavBar.css';
import profileIcon from '../assets/Images/Profile.jpg'

const NavBar = ({ userName, isLoggedIn }) => {

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
