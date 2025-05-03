import React, { useState } from "react";
import Scanner from "../components/Scanner";

const AddStocks = () => {
  const [showScanner, setShowScanner] = useState(true);

  const handleScanComplete = (result) => {
    console.log("✅ Add Stocks - Scanned:", result);
    setShowScanner(false);
  };

  return (
    <div>
      <h2>Add Stocks</h2>
      {showScanner && <Scanner onScan={handleScanComplete} />}
    </div>
  );
};

export default AddStocks;
