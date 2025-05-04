import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { createRecord } from "../api/kintoneService";

const AddStocks = () => {
  const [showScanner, setShowScanner] = useState(true);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleScanComplete = (result) => {
    console.log("✅ Add Stocks - Scanned:", result);
    const [stockID, name, quantity, price] = result.split(",");
    setFormData({
      stockID: stockID || "",
      productName: name || "",
      quantity: quantity || "",
      price: price || "",
    });
    setShowScanner(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const record = {
        stockID: { value: parseInt(formData.stockID) },
        productName: { value: formData.productName },
        quantity: { value: formData.quantity },
        price: { value: formData.price },
      };

      const response = await createRecord(29, record);
      setSuccessMessage(`✅ Stock added successfully (ID: ${response.id})`);
      setError(null);
      setFormData(null);
    } catch (err) {
      setError(err.message || "❌ Failed to add stock");
      setSuccessMessage("");
    }
  };

  const handleAddNewItem = () => {
    setShowScanner(true);
    setFormData(null);
    setSuccessMessage("");
    setError(null);
  };

  return (
    <div>
      <h2>Add Stocks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {showScanner && <Scanner onScan={handleScanComplete} />}

      {!showScanner && formData && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Stock ID:</label>
            <input
              type="text"
              name="stockID"
              value={formData.stockID}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">✅ Submit</button>
        </form>
      )}

      {!showScanner && !formData && (
        <button onClick={handleAddNewItem}>➕ Add New Item</button>
      )}
    </div>
  );
};

export default AddStocks;
