import React, { useState, useEffect } from "react";
//styles
import "./Logo.css";
//@MUI
import { ListItem, ListItemText, ListItemButton, Divider } from "@mui/material";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/MyAuction.json";

/**
 * Notification list item card containing information about one finished auction.
 * @param {string} address - address of specific auction.
 */
function NotificationCard({ address }) {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionNotification, setAuctionNotification] = useState();
  const [highestBidder, setHighestBidder] = useState();

  //fetch data specific to address with web3
  async function load() {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    //interact with specific contract
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    //getHighestBid
    const highest_bidder = await Auction.methods.getHighestBidder().call();
    setHighestBidder(highest_bidder);
  }

  useEffect(() => {
    load();
  }, []);

  //check if auction state is over
  const auctionResults = async (address) => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    const state = await Auction.methods
      .returnState()
      .call()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
    return state;
  };

  //set finalised
  const handleSubmitFinalised = async (address) => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    await Auction.methods
      .setFinalised()
      .send({ from: account })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {auctionResults(address) === "1" ? (
        <>
          <ListItem>
            <ListItemText
              primary={`Auction Winner: ${highestBidder}`}
              secondary={`Auction ID: ${address}`}
            />
            <ListItemButton
              onClick={() => {
                handleSubmitFinalised(address);
              }}
            >
              OK
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default NotificationCard;
