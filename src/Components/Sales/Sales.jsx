import React, { useState } from "react";
import Customer from "./Customer";
import SalesOrder from "./SalesOrder";
// import Shipment from "./Shipment";
import Payment from "./Payment";
import SalesReturn from "./SalesReturn";
import "./CSS/Sales.css";

const Sales = () => {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="sales-container">
      <h2>Sales Management</h2>

      <div className="sales-tabs">
        <button onClick={() => setActiveTab("customer")} className={activeTab === "customer" ? "active" : ""}>
          Customer
        </button>
        <button onClick={() => setActiveTab("salesOrder")} className={activeTab === "salesOrder" ? "active" : ""}>
          Sales Order
        </button>
        {/* <button onClick={() => setActiveTab("shipment")} className={activeTab === "shipment" ? "active" : ""}>
          Shipment
        </button> */}
        {/* <button onClick={() => setActiveTab("payment")} className={activeTab === "payment" ? "active" : ""}>
          Payment
        </button> */}
        <button onClick={() => setActiveTab("salesReturn")} className={activeTab === "salesReturn" ? "active" : ""}>
          Sales Return
        </button>
      </div>

      <div className="sales-content">
        {activeTab === "customer" && <Customer />}
        {activeTab === "salesOrder" && <SalesOrder />}
        {/* {activeTab === "shipment" && <Shipment />}
        {activeTab === "payment" && <Payment />} */}
        {activeTab === "salesReturn" && <SalesReturn />}
      </div>
    </div>
  );
};

export default Sales;
