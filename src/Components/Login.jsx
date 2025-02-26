import React, { useState } from "react";
import axios from "axios";
import './CSS/Login.css'
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate=useNavigate()
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault();
    const req=await axios.post("http://localhost:5001/login",{
      Email:Email,
      Password:Password
    })
    const message=req.data.message
    const isLoggedin=req.data.isLoggedin
    if(isLoggedin){
      alert(message)
      navigate('/')
    }else{
      alert(message)
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
}

export default Login;
