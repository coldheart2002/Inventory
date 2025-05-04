import React, { useEffect, useState } from "react";
import { getAllRecords } from "../api/kintoneService"; // Adjust path as needed
import "./ViewStocks.css"; // We'll create a separate CSS file for styling

const ViewStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const appId = 29;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRecords(appId);
        setStocks(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      }
    };
    fetchData();
  }, [appId]);

  return (
    <div className="view-stocks">
      <h2>View Stocks</h2>
      {error && <p className="error">{error}</p>}
      {stocks.length > 0 ? (
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Stock ID</th>
              <th>Product Name</th>
              <th>Remaining Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.$id.value}>
                <td>{stock.stockID?.value || "-"}</td>
                <td>{stock.productName?.value || "-"}</td>
                <td>{stock.quantity?.value || "0"} pcs</td>
                <td>₱ {stock.price?.value || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewStocks;
