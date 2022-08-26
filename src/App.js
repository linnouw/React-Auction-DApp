//control desk balcony paddle camp trial diary cruise pluck lion jeans property
//-----------------------------------------------------------------------------------------------
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
//useContext
import Web3Context from "./Web3Context";

function App() {
  const [auctionAddressList, setAuctionAddressList] = useState();
  const projectUrl = "http://localhost:8545";

  /**fetch auction addresses list with web3*/
  async function load() {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
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
  }, [auctionAddressList]);

  return (
    <div>
      <Web3Context.Provider
        value={{
          auctionAddressList,
          projectUrl,
        }}
      >
        <Home />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/bids" element={<Bids />} />
        </Routes>
      </Web3Context.Provider>
    </div>
  );
}

export default App;
