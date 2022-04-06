import React, { useState, useEffect } from "react";
//styles
import "./AuctionCard.css";
//@MUI
import {
  Card,
  Typography,
  Grid,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/MyAuction.json";

function EndAuction(props) {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionWinner, setAuctionWinner] = useState();

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

      //get auction winner at the end of the auction
      const auction_winner = await Auction.methods.endAuction().call();
      console.log(auction_winner);
    }

    load();
  });

  return <Typography>winner </Typography>;
}

export default EndAuction;
