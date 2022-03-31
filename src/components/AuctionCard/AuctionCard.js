import React, { useState, useEffect } from "react";
//components
import Confirmation from "./Confirmation";
import Timer from "./Timer";
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

function AuctionCard(props) {
  const [open, setOpen] = React.useState(false);
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionEvent, setAuctionEvent] = useState([]);
  const [highestBid, setHighestBid] = useState();
  const [timestamp, setTimestamp] = useState();
  const [auctionStart, setAuctionStart] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      //get auction content
      const event = await Auction.methods.returnContents().call();
      setAuctionEvent(event);

      //get highest bid value
      const highest_bid = await Auction.methods.highestBid.call().call();
      //const highest_bidder = await Auction.methods.getHighestBidder().call();
      setHighestBid(highest_bid * Math.pow(10, -18));

      //get auction start
      const auction_start = await Auction.methods.auctionStart.call().call();
      setAuctionStart(auction_start);
    }

    load();
  });

  return (
    <div>
      <Card sx={{ maxWidth: 300 }} className="auction-card">
        <CardContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Timer auctionEnd={auctionEvent[6]} />
          </Grid>
          <Typography variant="h6">{auctionEvent[1]}</Typography>
          <Typography variant="h6">{auctionEvent[2]}</Typography>
          <Typography className="auction-description">
            {auctionEvent[2]}
          </Typography>
          <Typography>Starting price: {auctionEvent[3]} ETH</Typography>
          {highestBid !== 0 ? (
            <Typography style={{ color: "red" }}>
              Current highest bid : {highestBid} ETH
            </Typography>
          ) : (
            <></>
          )}
          <Typography>Min increment: {auctionEvent[5]} ETH</Typography>
          <Typography>Auction duration: {auctionEvent[4]}H</Typography>
          <Typography className="auction-owner">
            Owner: {auctionEvent[0]}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container direction="row">
            {account === auctionEvent[0] ? (
              <Button disabled variant="text">
                Bid on
              </Button>
            ) : (
              <Button variant="text" onClick={handleOpen}>
                Bid on
              </Button>
            )}
          </Grid>
        </CardActions>
      </Card>

      <Confirmation
        owner={auctionEvent[0]}
        address={props.address}
        open={open}
        closeModal={handleClose}
      />
    </div>
  );
}

export default AuctionCard;
