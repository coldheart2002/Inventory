import React, { useEffect, useState, useMemo } from "react";
import { getAllRecords } from "../api/kintoneService";
import { saveAs } from "file-saver"; // For CSV download
import "./ViewStocks.css";

const DEFAULT_ITEMS_PER_PAGE = 20;

const ViewStocks = () => {
  const appId = 29;

  // States
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Sorting states
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Search/filter states
  const [searchText, setSearchText] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllRecords(appId);
        const data = response.data || [];
        setStocks(data);
        setFilteredStocks(data);
        setCurrentPage(1); // reset page on data load
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appId]);

  // Handle filtering
  useEffect(() => {
    let filtered = [...stocks];

    // Filter by search text (productName or stockID)
    if (searchText.trim() !== "") {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName?.value.toLowerCase().includes(lower) ||
          item.stockID?.value.toLowerCase().includes(lower)
      );
    }

    // No quantity min/max filtering now

    setFilteredStocks(filtered);
    setCurrentPage(1); // reset to first page when filters change
  }, [searchText, stocks]);

  // Handle sorting
  const sortedStocks = useMemo(() => {
    if (!sortConfig.key) return filteredStocks;

    const sorted = [...filteredStocks].sort((a, b) => {
      const aVal = a[sortConfig.key]?.value ?? "";
      const bVal = b[sortConfig.key]?.value ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      // String compare
      return sortConfig.direction === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

    return sorted;
  }, [filteredStocks, sortConfig]);

  // Pagination calculations
  const totalItems = sortedStocks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedStocks = sortedStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // CSV export
  const exportCSV = () => {
    if (paginatedStocks.length === 0) return;
    const header = ["Stock ID", "Product Name", "Quantity", "Price"];
    const rows = paginatedStocks.map((item) => [
      item.stockID?.value || "",
      item.productName?.value || "",
      item.quantity?.value || "",
      item.price?.value || "",
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `stocks_page_${currentPage}.csv`);
  };

  return (
    <div className="view-stocks-container">
      <h2>View Stocks</h2>

      <div className="controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by Stock ID or Product Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {/* Removed min/max quantity inputs */}
        </div>

        <div className="pagination-controls">
          <label>
            Items per page:{" "}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to page 1 on change
              }}
            >
              {[10, 20, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <button onClick={exportCSV} disabled={paginatedStocks.length === 0}>
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading stocks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : paginatedStocks.length === 0 ? (
        <p className="empty-state">No stocks found with the current filters.</p>
      ) : (
        <>
          <table className="stocks-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("stockID")}>
                  Stock ID{" "}
                  {sortConfig.key === "stockID" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => requestSort("productName")}>
                  Product Name{" "}
                  {sortConfig.key === "productName" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => requestSort("quantity")}>
                  Quantity{" "}
                  {sortConfig.key === "quantity" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => requestSort("price")}>
                  Price{" "}
                  {sortConfig.key === "price" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.map((stock) => (
                <tr key={stock.$id.value}>
                  <td>{stock.stockID?.value || "-"}</td>
                  <td>{stock.productName?.value || "-"}</td>
                  <td>{stock.quantity?.value || 0} pcs</td>
                  <td>₱ {stock.price?.value || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-buttons">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewStocks;
