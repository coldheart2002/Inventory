import React, { useEffect, useState } from "react";
import { getRecord } from "../api/kintoneService"; // Adjust the path as needed

const ViewStocks = () => {
  const [stocks, setStocks] = useState(null);
  const [error, setError] = useState(null);

  const appId = 28;
  const recordId = 8; // You can modify this to dynamically fetch different records

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecord(appId, recordId);
        setStocks(data);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      }
    };
    fetchData();
  }, [appId, recordId]); // Dependency array to re-fetch when appId or recordId changes

  return (
    <div>
      <h2>View Stocks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stocks ? (
        <pre>{JSON.stringify(stocks, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewStocks;
