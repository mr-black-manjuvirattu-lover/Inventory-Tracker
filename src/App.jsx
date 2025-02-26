import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"; 
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import StockManagement from "./Components/StockManagement";
import ProductManagement from "./Components/ProductManagement";

const App = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <MainContent userName={userName} setUserName={setUserName} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    </Router>
  );
};

const MainContent = ({ userName, setUserName, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  const hideNavBar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavBar && <NavBar userName={userName} isLoggedIn={isLoggedIn} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserName={setUserName} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/stocks" element={<StockManagement />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
