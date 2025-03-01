import React, { useState } from "react";
import Vendor from "./Vendor";
import Expenses from "./Expenses";
import PurchaseOrders from "./PurchaseOrders";
import PurchaseReceives from "./PurchaseReceives";
import Bills from "./Bills";
import "./CSS/Purchases.css"

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("vendor");

  return (
    <div className="purchase-container">
      <h2>Purchase Management</h2>

      <div className="purchase-tabs">
        <button onClick={() => setActiveTab("vendor")} className={activeTab === "vendor" ? "active" : ""}>
          Vendor
        </button>
        <button onClick={() => setActiveTab("expenses")} className={activeTab === "expenses" ? "active" : ""}>
          Expenses
        </button>
        <button onClick={() => setActiveTab("purchaseOrders")} className={activeTab === "purchaseOrders" ? "active" : ""}>
          Purchase Orders
        </button>
        <button onClick={() => setActiveTab("purchaseReceives")} className={activeTab === "purchaseReceives" ? "active" : ""}>
          Purchase Receives
        </button>
        <button onClick={() => setActiveTab("bills")} className={activeTab === "bills" ? "active" : ""}>
          Bills
        </button>
      </div>

      <div className="purchase-content">
        {activeTab === "vendor" && <Vendor />}
        {activeTab === "expenses" && <Expenses />}
        {activeTab === "purchaseOrders" && <PurchaseOrders />}
        {activeTab === "purchaseReceives" && <PurchaseReceives />}
        {activeTab === "bills" && <Bills />}
      </div>
    </div>
  );
};

export default Purchases;
