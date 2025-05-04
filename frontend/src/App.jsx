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
import Scanner from "./components/Scanner";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <button onClick={() => navigate("/add")}>Add Stocks</button>
      <button onClick={() => navigate("/withdraw")}>Withdraw Stocks</button>
      <button onClick={() => navigate("/view")}>View Stocks</button>
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
