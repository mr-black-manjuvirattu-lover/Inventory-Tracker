import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./CSS/Home.css";

const Home = () => {
  const features = [
    { title: "Dashboard", desc: "Get an overview of your inventory in real-time." },
    { title: "Sales", desc: "Track all your sales transactions easily." },
    { title: "Purchase", desc: "Manage stock purchases efficiently." },
    { title: "Report", desc: "Generate detailed reports on inventory and sales." },
    { title: "Contact", desc: "Get support and reach out to us anytime." },
  ];

  return (
    <>
      <div className="home-container">
        <motion.div className="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <h1>Manage Your Inventory Efficiently</h1>
          <p>Track sales, purchases, and generate insightful reports seamlessly.</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-box"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
