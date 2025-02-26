import React, { useState } from "react";
import axios from "axios";
import './CSS/Login.css';
import { useNavigate } from "react-router-dom";

function Login({ setUserName, setIsLoggedIn }) {
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
      const response = await axios.post("http://localhost:5001/login", {
        Email: Email,
        Password: Password,
      });

      const message = response.data.message;
      const isLoggedin = response.data.isLoggedin;

      if (isLoggedin) {
        setUserName(response.data.userName); 
        setIsLoggedIn(true);
        alert(message);
        navigate("/dashboard");
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
            Login
          </button>
          {loading && <p>Loading...</p>}
        </form>
        {error && <p className="error-message">{error}</p>}
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
    
  );
}

export default Login;
