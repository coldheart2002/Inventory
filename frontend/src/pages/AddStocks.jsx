import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { createRecord } from "../api/kintoneService";
import "./AddStocks.css";

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
        stockID: { value: formData.stockID },
        productName: { value: formData.productName },
        quantity: { value: parseInt(formData.quantity) },
        price: { value: parseFloat(formData.price) },
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
    <div className="addstocks-container">
      <h2 className="page-title">Add Stocks</h2>

      {error && <p className="message error">{error}</p>}
      {successMessage && <p className="message success">{successMessage}</p>}

      {showScanner && <Scanner onScan={handleScanComplete} />}

      {!showScanner && formData && (
        <form className="stock-form" onSubmit={handleSubmit}>
          <label>
            Stock ID:
            <input
              type="text"
              name="stockID"
              value={formData.stockID}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </label>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Price: ₱
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="button-row">
            <button type="submit" className="btn primary">
              ✅ Submit
            </button>
            <button
              type="button"
              onClick={handleAddNewItem}
              className="btn secondary"
            >
              🔄 Rescan
            </button>
          </div>
        </form>
      )}

      {!showScanner && !formData && (
        <button onClick={handleAddNewItem} className="btn primary add-new">
          ➕ Add New Item
        </button>
      )}
    </div>
  );
};

export default AddStocks;
