import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import StockManagement from "./StockManagement";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setUserId(null);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-sections">
        <div className="dashboard-card">
          <ProductManagement userId={userId} />
        </div>
        <div className="dashboard-card">
          <StockManagement userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
