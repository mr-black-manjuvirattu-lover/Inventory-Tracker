import React from "react";
import ProductManagement from "./ProductManagement";
import StockManagement from "./StockManagement";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-sections">
        <div className="dashboard-card">
          <ProductManagement />
        </div>
        <div className="dashboard-card">
          <StockManagement />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
