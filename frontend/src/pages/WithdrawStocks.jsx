import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { getRecord } from "../api/kintoneService";

const WithdrawStocks = () => {
  const [showScanner, setShowScanner] = useState(true);
  const [stockID, setStockID] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const appId = 29;

  const handleScanComplete = (result) => {
    console.log("🧾 Scanned Stock ID:", result);
    setStockID(result);
    setShowScanner(false);
  };

  const handleFetchRecord = async () => {
    try {
      const response = await getRecord(appId, stockID);
      const resRecord = response.data[0];

      const newRecord = {
        recordID: resRecord.$id.value,
        recordStockID: resRecord.stockID.value,
        recordProductName: resRecord.productName.value,
        recordQuantity: resRecord.quantity.value,
        recordPrice: resRecord.price.value,
        withdrawQuantity: 1,
        paymentPrice: resRecord.price.value * 1,
        originalQuantity: resRecord.quantity.value,
      };

      setRecords((prev) => [...prev, newRecord]);
      setError(null);
      setStockID(null);
      setShowScanner(false);
    } catch (err) {
      setError(err.message || "❌ Failed to fetch stock record");
    }
  };

  const handleRescan = () => {
    setStockID(null);
    setError(null);
    setShowScanner(true);
  };

  const handleWithdrawChange = (index, value) => {
    const updatedRecords = [...records];
    const qty = parseInt(value) || 0;

    const safeQty = Math.min(qty, updatedRecords[index].originalQuantity);
    updatedRecords[index].withdrawQuantity = safeQty;
    updatedRecords[index].paymentPrice =
      safeQty * updatedRecords[index].recordPrice;

    const remaining = updatedRecords[index].originalQuantity - safeQty;
    updatedRecords[index].recordWarning =
      remaining <= 0 ? "⚠️ Inventory is now empty!" : "";

    setRecords(updatedRecords);
  };

  const handleRemoveRecord = (index) => {
    const confirmation = window.confirm(
      "Are you sure you want to remove this record?"
    );
    if (confirmation) {
      const updatedRecords = [...records];
      updatedRecords.splice(index, 1);
      setRecords(updatedRecords);

      // If no records remain, go back to QR scanning
      if (updatedRecords.length === 0) {
        setShowScanner(true);
      }
    }
  };

  const handleSubmit = () => {
    const dataToSubmit = records.map((rec) => ({
      recordStockID: rec.recordStockID,
      remainingQty: rec.originalQuantity - rec.withdrawQuantity,
    }));

    console.log("📝 Records to Submit:", JSON.stringify(records, null, 2));
    console.log(
      "📝 Processed Submit Data:",
      JSON.stringify(dataToSubmit, null, 2)
    );
  };

  const totalPayment = records.reduce((sum, rec) => sum + rec.paymentPrice, 0);

  return (
    <div>
      <h2>Withdraw Stocks</h2>

      {showScanner && <Scanner onScan={handleScanComplete} />}

      {stockID && (
        <div>
          <p>
            📦 Scanned Stock ID: <strong>{stockID}</strong>
          </p>
          <button onClick={handleFetchRecord}>🔍 Get Stock Info</button>
          <button onClick={handleRescan} style={{ marginLeft: "10px" }}>
            🔄 Rescan
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {records.length > 0 && (
        <div>
          <h3>✅ Stock Records</h3>
          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Product Name</th>
                <th>Inventory Qty</th>
                <th>Price</th>
                <th>Withdraw Qty</th>
                <th>Payment Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, index) => (
                <tr key={rec.recordID}>
                  <td>{rec.recordStockID}</td>
                  <td>{rec.recordProductName}</td>
                  <td>
                    {rec.originalQuantity - rec.withdrawQuantity < 0
                      ? 0
                      : rec.originalQuantity - rec.withdrawQuantity}
                    <br />
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {rec.recordWarning}
                    </span>
                  </td>
                  <td>₱ {rec.recordPrice}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={rec.withdrawQuantity}
                      onChange={(e) =>
                        handleWithdrawChange(index, e.target.value)
                      }
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td>₱ {rec.paymentPrice}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveRecord(index)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "black",
                      }}
                      title="Delete Record"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total Payment:
                </td>
                <td style={{ fontWeight: "bold" }}>₱ {totalPayment}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <button onClick={handleRescan} style={{ marginTop: "10px" }}>
            ➕ Add Another Stock
          </button>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "10px",
              backgroundColor: "green",
              color: "white",
            }}
          >
            📝 Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default WithdrawStocks;
