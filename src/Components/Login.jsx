import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './CSS/Login.css';

function Login({ setUserName, setIsLoggedIn, setUserId }) {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      console.log("Logging in...");
      const startTime = performance.now();
  
      const response = await axios.post("https://inventory-tracker-1fnw.onrender.com/login", {
        Email,
        Password,
      });
  
      const endTime = performance.now();
      console.log(`Login request took ${endTime - startTime} ms`);
  
      const { message, isLoggedin, userName, userId } = response.data;
  
      if (isLoggedin) {
        setUserName(userName);
        setUserId(userId);
        setIsLoggedIn(true);
  
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        
        navigate("/home"); 
      } else {
        alert(message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="Body">
      <div className="login-container">
        <h2>Login To Inventory-Tracker</h2>
        <form onSubmit={handleLogin}>
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
            <label>Password</label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
      </div>
    </div>
  );
}

export default Login;
