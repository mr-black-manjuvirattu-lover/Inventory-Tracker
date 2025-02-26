import React, { useState } from "react";
import './CSS/Signup.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate=useNavigate()
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const handleSignup =async (e) => {
    e.preventDefault();
    if(Password===ConfirmPassword){
      const req=await axios.post("http://localhost:5001/signup",{
        Name:Name,
        Email:Email,
        Password:Password,
        PhoneNumber:PhoneNumber
      })
      const message=req.data.message
      const isSignup=req.data.isSignup
      if(isSignup){
        alert(message)
        navigate('/login')
      }else{
        alert(message)
      }
    }else{
      alert("Password Not Matched")
    }
    
  }

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Signup;
