import React, { useState, useEffect, useContext } from "react";
//components
import Confirmation from "./Confirmation";
import Infos from "./Infos";
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
import Web3 from "web3/dist/web3.min.js";
import my_auction_contract from "../../abi/MyAuction.json";
//useContext
import Web3Context from "../../Web3Context";

/**
 * Contains information (name, description, duration, min increment and starting price) of a started auction.
 * Contains bid on button and a timer.
 * @param {string} address - address of a specific auction
 * @param {boolean} auctionFinished - returns true if auction is finished, else false
 */
function AuctionCard({ address, auctionFinished }) {
  const context = useContext(Web3Context);
  const { projectUrl } = context;
  const [open, setOpen] = React.useState(false);
  const [openInfos, setOpenInfos] = React.useState(false);
  const [auctionEvent, setAuctionEvent] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState();
  const [ipfsUrl, setIpfsUrl] = useState();

  const handleOpenInfos = () => setOpenInfos(true);
  const handleCloseInfos = () => setOpenInfos(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  async function load() {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
    //interact with specific contract
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    //get auction content
    const event = await Auction.methods.returnContents().call();
    setAuctionEvent(event);
    //get highest bid
    const highest_bid = await Auction.methods.highestBid.call().call();
    setHighestBid(highest_bid);
    //get highest bidder which is auction winner
    const highest_bidder = await Auction.methods.getHighestBidder().call();
    setHighestBidder(highest_bidder);
    //get ipfs hash
    const url = await Auction.methods.getIpfsHash().call();
    setIpfsUrl(url);
  }

  useEffect(() => {
    load();
  }, [highestBid]);

  return (
    <>
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

          <Button variant="text" onClick={handleOpenInfos}>
            <Typography className="auction-description">
              More infos...
            </Typography>
          </Button>

          <Typography>Starting price: {auctionEvent[3]} ETH</Typography>
          <Typography>Min increment: {auctionEvent[5]} ETH</Typography>
          <Typography>Auction duration: {auctionEvent[4]} MIN</Typography>
          <Typography className="auction-owner">
            Owner: {auctionEvent[0]}
          </Typography>
          {highestBid * Math.pow(10, -18) !== 0 ? (
            <Typography className="blink">
              Current highest bid : {highestBid * Math.pow(10, -18)} ETH
            </Typography>
          ) : (
            <></>
          )}
        </CardContent>
        <CardActions>
          <Grid container direction="column">
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
        address={address}
        open={open}
        closeModal={handleClose}
      />
      <Infos
        openInfos={openInfos}
        closeModalInfos={handleCloseInfos}
        ipfsUrl={ipfsUrl}
      />
    </>
  );
}

export default AuctionCard;
