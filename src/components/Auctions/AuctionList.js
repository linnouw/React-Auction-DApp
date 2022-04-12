import React, { useState, useEffect } from "react";
//components
import AuctionCard from "../AuctionCard/AuctionCard";
//styles
import "./Auctions.css";
//@MUI
import { Grid } from "@mui/material";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/MyAuction.json";

function AuctionList(props) {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionFinished, setAuctionFinished] = useState();

  useEffect(() => {
    load();
  }, [account]);

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

      //transfer ether from smart contract to auction owner
      await Auction.methods.transferHighestBid().send({ from: account });

      //refund all the bidders
      await Auction.methods.refundBidders().send({ from: account });
    } else await setAuctionFinished(false);
  }

  return (
    <Grid item xs={3}>
      <AuctionCard address={props.address} auctionFinished={auctionFinished} />
    </Grid>
  );
}

export default AuctionList;
