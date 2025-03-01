import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom"; 
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import NavBar from "./Components/NavBar";
import About from "./Components/About";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import StockManagement from "./Components/StockManagement";
import ProductManagement from "./Components/ProductManagement";
import Sales from "./Components/Sales/Sales";
import Purchases from "./Components/Purchases/Purchases";
import ReportPage from "./Components/ReportPage";
import Contact from "./Components/Contact"
import Customer from "./Components/Sales/Customer";

const App = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!userId); 

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  
    setUserId(null);
    setUserName("");
    setIsLoggedIn(false);
  };

  
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    }
  }, [userId, userName]);

  return (
    <Router>
      <MainContent 
        userName={userName} setUserName={setUserName} 
        isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} 
        userId={userId} setUserId={setUserId} 
        handleLogout={handleLogout}
      />
    </Router>
  );
};

const MainContent = ({ userName, setUserName, isLoggedIn, setIsLoggedIn, userId, setUserId, handleLogout }) => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavBar && <NavBar userName={userName} isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<About/>}/>
        <Route 
          path="/login" 
          element={<Login setUserName={setUserName} setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/products" element={<ProductManagement userId={userId} />} />
        <Route path="/stocks" element={<StockManagement userId={userId} />} />
        <Route path="/report" element={<ReportPage/>}/>
        <Route path="/sales" element={<Sales/>}/>
        <Route path="/purchases" element={<Purchases/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
