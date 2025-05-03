import React, { useState } from "react";
import Scanner from "../components/Scanner";

const WithdrawStocks = () => {
  const [showScanner, setShowScanner] = useState(true);

  const handleScanComplete = (result) => {
    console.log("🧾 Withdraw Stocks - Scanned:", result);
    setShowScanner(false);
  };

  return (
    <div>
      <h2>Withdraw Stocks</h2>
      {showScanner && <Scanner onScan={handleScanComplete} />}
    </div>
  );
};

export default WithdrawStocks;
