import React, { useState, useEffect, useContext } from "react";
//components
import AuctionCard from "../AuctionCard/AuctionCard";
//styles
import "./Auctions.css";
//@MUI
import { Grid } from "@mui/material";
//web3
import Web3 from "web3/dist/web3.min.js";
import my_auction_contract from "../../abi/MyAuction.json";
//useContext
import Web3Context from "../../Web3Context";
/**
 * contains
 * @param {string} address
 */
function AuctionList({ address }) {
  const context = useContext(Web3Context);
  const { projectUrl } = context;
  const [auctionFinished, setAuctionFinished] = useState(false);

  const [haveMetamask, sethaveMetamask] = React.useState(true);
  const [account, setAccount] = React.useState('');
  const [active, setActive] = React.useState(false);

  const { ethereum } = window;

  const connect = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      setActive(true);
    } catch (error) {
      setActive(false);
    }
  };

  useEffect(() => {
    load();
  }, [account]);

  async function load() {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
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
    }
  }

  return (
    <>
      {auctionFinished ? (
        <></>
      ) : (
        <Grid item xs={3}>
          <AuctionCard address={address} auctionFinished={auctionFinished} />
        </Grid>
      )}
    </>
  );
}

export default AuctionList;
