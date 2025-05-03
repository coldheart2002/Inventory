import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { getRecord } from "../api/kintoneService";

const WithdrawStocks = () => {
  const [showScanner, setShowScanner] = useState(true);
  const [stockID, setStockID] = useState(null);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  const appId = 29;

  const handleScanComplete = (result) => {
    console.log("🧾 Scanned Stock ID:", result);
    setStockID(result); // Store scanned ID
    setShowScanner(false);
  };

  const handleFetchRecord = async () => {
    try {
      const response = await getRecord(appId, stockID); // Using stockID as recordId for now
      setRecord(response);
      setError(null);
    } catch (err) {
      setError(err.message || "❌ Failed to fetch stock record");
      setRecord(null);
    }
  };

  const handleRescan = () => {
    setStockID(null);
    setRecord(null);
    setError(null);
    setShowScanner(true);
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

      {record && (
        <div>
          <h3>✅ Stock Record</h3>
          <pre>{JSON.stringify(record, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WithdrawStocks;
