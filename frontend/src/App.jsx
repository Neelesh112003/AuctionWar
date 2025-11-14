import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import CreateAuction from "./pages/CreateAuction";
import Auctions from "./pages/Auctions";
import AuctionDetail from "./pages/AuctionDetails";
import AuctionSearch from "./pages/AuctionSearch";
import MyAuctions from "./pages/MyAuctions";
import MyBids from "./pages/MyBids";
import MyCurrentBids from "./pages/MyCurrentBids";
import MyCompletedBids from "./pages/MyCompletedBids";

function App() {
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'

  // Optional: toggle theme button
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div
      className={theme}
      style={{
        background: theme === "dark" ? "#18181a" : "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Router>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions/search" element={<AuctionSearch />} />
            <Route path="/my-auctions" element={<MyAuctions />} />
            <Route path="/my-bids" element={<MyBids />} />
            <Route path="/my-bids/current" element={<MyCurrentBids />} />
            <Route path="/my-bids/completed" element={<MyCompletedBids />} />
          </Routes>
        </main>
        <Footer theme={theme} />
      </Router>
    </div>
  );
}

export default App;
