import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Select, MenuItem } from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportPage = () => {
  const [reportType, setReportType] = useState("products");
  const [fileType, setFileType] = useState("csv");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/reports?type=${reportType}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  const generateReport = () => {
    if (fileType === "csv") {
      generateCSV();
    } else if (fileType === "pdf") {
      generatePDF();
    } else if (fileType === "json") {
      generateJSON();
    }
  };

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += Object.keys(data[0]).join(",") + "\n";
    data.forEach((row) => {
      csvContent += Object.values(row).join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${reportType}_report.csv`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${reportType.toUpperCase()} REPORT`, 20, 20);
    doc.autoTable({ html: "#reportTable" });
    doc.save(`${reportType}_report.pdf`);
  };

  const generateJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, `${reportType}_report.json`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Generate Report</h2>
      <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
        <MenuItem value="products">Products</MenuItem>
        <MenuItem value="stock">Stock</MenuItem>
        <MenuItem value="both">Both</MenuItem>
      </Select>
      <Select value={fileType} onChange={(e) => setFileType(e.target.value)}>
        <MenuItem value="csv">CSV</MenuItem>
        <MenuItem value="pdf">PDF</MenuItem>
        <MenuItem value="json">JSON</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={generateReport}>
        Download Report
      </Button>

      <table id="reportTable" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPage;
