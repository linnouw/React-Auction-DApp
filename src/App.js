import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
//components
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Auctions from "./components/Auctions/Auctions";
import Bids from "./components/Bids/Bids";
//styles
import "./App.css";
//web3
import Web3 from "web3";
import auction_list_contract from "./abi/AuctionList.json";

function App() {
  //store auction list
  const [auctionAddressList, setAuctionAddressList] = useState();

  //fetch auction addresses list with web2
  async function load() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const networkId = await web3.eth.net.getId();
    const AuctionListContract = new web3.eth.Contract(
      auction_list_contract.abi,
      auction_list_contract.networks[networkId].address
    );

    const auctions = await AuctionListContract.methods.getAllAuctions().call();

    setAuctionAddressList(auctions);
  }

  useEffect(() => {
    load();
  });

  return (
    <div>
      <Home auctionAddressList={auctionAddressList} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/auctions"
          element={<Auctions auctionAddressList={auctionAddressList} />}
        />
        <Route
          path="/bids"
          element={<Bids auctionAddressList={auctionAddressList} />}
        />
      </Routes>
    </div>
  );
}

export default App;
