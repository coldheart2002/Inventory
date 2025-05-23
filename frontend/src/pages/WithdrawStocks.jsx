import React, { useState } from "react";
import Scanner from "../components/Scanner";
import {
  getRecordUsingFieldCode,
  updateRecord,
  getRecord,
} from "../api/kintoneService";

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
      console.log("API response:", response);

      if (!response.data || response.data.length === 0) {
        setError("No record found for this Stock ID");
        return;
      }

      const resRecord = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      const newRecord = {
        recordID: resRecord?.$id?.value || "",
        recordStockID: resRecord?.stockID?.value || "",
        recordProductName: resRecord?.productName?.value || "",
        recordQuantity: resRecord?.quantity?.value || 0,
        recordPrice: resRecord?.price?.value || 0,
        withdrawQuantity: 1,
        paymentPrice: (resRecord?.price?.value || 0) * 1,
        originalQuantity: resRecord?.quantity?.value || 0,
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

      if (updatedRecords.length === 0) {
        setShowScanner(true);
      }
    }
  };

  const totalPayment = records.reduce((sum, rec) => sum + rec.paymentPrice, 0);

  // NOTE: Implement your submit logic here!
  const handleSubmit = async () => {
    const stockIDs = records.map((rec) => rec.recordStockID);
    console.log("Submitting withdrawal for stock IDs:", stockIDs);

    try {
      // Fetch current records by stockIDs
      const response = await getRecordUsingFieldCode(appId, stockIDs);
      console.log("Fetched records from backend:", response);

      if (!response || !response.data) {
        throw new Error("No data returned from getRecordUsingFieldCode");
      }

      // Update each record with new quantity
      const updatePromises = response.data.map((record) => {
        const localRecord = records.find(
          (rec) => rec.recordStockID === record.stockID.value
        );

        if (!localRecord) {
          console.warn(
            `No local record found for stockID ${record.stockID.value}`
          );
          return Promise.resolve();
        }

        const newQuantity =
          record.quantity.value - localRecord.withdrawQuantity;
        console.log(
          `Updating record ${record.$id.value} with new quantity ${newQuantity}`
        );

        return updateRecord(appId, record.$id.value, {
          quantity: {
            value: newQuantity >= 0 ? newQuantity : 0,
          },
        });
      });

      const results = await Promise.all(updatePromises);
      console.log("Update results:", results);

      alert("Withdrawal successful!");

      setRecords([]);
      setShowScanner(true);
      setStockID(null);
      setError(null);
    } catch (error) {
      console.error("Error during withdrawal submission:", error);
      alert(
        "Failed to submit withdrawal: " + (error.message || "Unknown error")
      );
      setError(error.message || "Unknown error");
    }
  };

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
        <>
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
                <th>Remaining Qty</th>
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
                    {Math.max(rec.originalQuantity - rec.withdrawQuantity, 0)}
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
            📝 Withdraw
          </button>
        </>
      )}
    </div>
  );
};

export default WithdrawStocks;
