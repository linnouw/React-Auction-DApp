import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
//components
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Auctions from "./components/Auctions/Auctions";
import Bids from "./components/Bids/Bids";
//styles
import "./App.css";

function App() {
  return (
    <div>
      <Home />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/bids" element={<Bids />} />
      </Routes>
    </div>
  );
}

export default App;
