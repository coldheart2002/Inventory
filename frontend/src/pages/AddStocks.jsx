import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { createRecord } from "../api/kintoneService";

const AddStocks = () => {
  const [showScanner, setShowScanner] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleScanComplete = async (result) => {
    console.log("✅ Add Stocks - Scanned:", result);
    const stockDetails = parseQRCode(result);

    try {
      const response = await createRecord(29, stockDetails);
      setSuccessMessage(`✅ Stock added successfully (ID: ${response.id})`);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to add stock");
      setSuccessMessage("");
    }

    setShowScanner(false);
  };

  const parseQRCode = (result) => {
    const [stockID, name, quantity, price] = result.split(",");
    return {
      stockID: { value: 8080 },
      productName: { value: name },
      quantity: { value: quantity },
      price: { value: price },
    };
  };

  const handleAddNewItem = () => {
    setShowScanner(true);
    setSuccessMessage("");
    setError(null);
  };

  return (
    <div>
      <h2>Add Stocks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {showScanner ? (
        <Scanner onScan={handleScanComplete} />
      ) : (
        <button onClick={handleAddNewItem}>➕ Add New Item</button>
      )}
    </div>
  );
};

export default AddStocks;
