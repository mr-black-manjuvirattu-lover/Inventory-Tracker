import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import StockManagement from "./Components/StockManagement";
import ProductManagement from "./Components/ProductManagement";

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductManagement/>}/>
        <Route path="/stocks" element={<StockManagement/>}/>
        <Route path="*" element={<h1>404 Not Found</h1>} /> 
      </Routes>
    </Router>
  );
}

export default App;
