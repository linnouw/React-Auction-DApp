import React, { useState, useEffect } from "react";
//components
import AuctionCard from "../AuctionCard/AuctionCard";
import EndAuction from "../AuctionCard/EndAuction";
//styles
import "./Auctions.css";
//@MUI
import { Grid } from "@mui/material";
//web3
import Web3 from "web3";
import my_auction_contract from "../../abi/MyAuction.json";

function AuctionList(props) {
  const [auctionFinished, setAuctionFinished] = useState();

  useEffect(() => {
    async function load() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:7545")
      );
      //interact with specific contract
      const Auction = new web3.eth.Contract(
        my_auction_contract.abi,
        props.address
      );
      //get auctionEnd value
      const auctionEnd = await Auction.methods.auctionEnd.call().call();

      if (auctionEnd - Math.round(new Date().getTime() / 1000) < 0) {
        await setAuctionFinished(true);
      } else await setAuctionFinished(false);
    }
    load();
  });

  return (
    <>
      {auctionFinished ? (
        <EndAuction address={props.address} />
      ) : (
        <Grid item xs={3}>
          <AuctionCard
            address={props.address}
            auctionFinished={auctionFinished}
          />
        </Grid>
      )}
    </>
  );
}

export default AuctionList;
