import React, { useState, useEffect, useContext } from "react";
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
//useContext
import Web3Context from "../../Web3Context";
/**
 * contains
 * @param {string} address
 */
function AuctionList({ address }) {
  const context = useContext(Web3Context);
  const { infuraProject } = context;
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionFinished, setAuctionFinished] = useState();

  useEffect(() => {
    load();
  }, [account]);

  async function load() {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraProject));
    //interact with specific contract
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    //get auctionEnd value
    const auctionEnd = await Auction.methods.auctionEnd.call().call();

    if (auctionEnd - Math.round(new Date().getTime() / 1000) < 0) {
      await setAuctionFinished(true);

      //transfer ether from smart contract to auction owner & refund bidders
      const HighestBidGas = await Auction.methods
        .transferHighestBid()
        .estimateGas();
      const refundBiddersGas = await Auction.methods
        .refundBidders()
        .estimateGas();

      await Auction.methods
        .transferHighestBid()
        .send({ from: account, gas: HighestBidGas })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
      await Auction.methods
        .refundBidders()
        .send({ from: account, gas: refundBiddersGas })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    } else await setAuctionFinished(false);
  }

  return (
    <Grid item xs={3}>
      <AuctionCard address={address} auctionFinished={auctionFinished} />
    </Grid>
  );
}

export default AuctionList;
