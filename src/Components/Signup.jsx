import React, { useState } from "react";
import './CSS/Signup.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (Password !== ConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true); 
    setError("");

    try {
      const req = await axios.post("https://inventory-tracker-1fnw.onrender.com/signup", {
        Name: Name,
        Email: Email,
        Password: Password,
        PhoneNumber: PhoneNumber
      });

      const message = req.data.message;
      const isSignup = req.data.isSignup;

      if (isSignup) {
        navigate('/login');
      } else {
        alert(message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Body">
      <div className="signup-container">
        <h2>SignUp Inventory Tracker</h2>
        <form onSubmit={handleSignup}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              value={PhoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>Sign Up</button>
          {loading && <p>Loading...</p>}
        </form>
        {error && <p className="error-message">{error}</p>} 
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
