import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import AddStocks from "./pages/AddStocks";
import WithdrawStocks from "./pages/WithdrawStocks";
import ViewStocks from "./pages/ViewStocks";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="app-title">Stock Management</h1>
      <div className="button-group">
        <button className="nav-button" onClick={() => navigate("/add")}>
          Add Stocks
        </button>
        <button className="nav-button" onClick={() => navigate("/withdraw")}>
          Withdraw Stocks
        </button>
        <button className="nav-button" onClick={() => navigate("/view")}>
          View Stocks
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddStocks />} />
        <Route path="/withdraw" element={<WithdrawStocks />} />
        <Route path="/view" element={<ViewStocks />} />
      </Routes>
    </Router>
  );
};

export default App;
