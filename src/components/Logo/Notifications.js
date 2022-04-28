import React, { useState, useEffect, useContext } from "react";
//styles
import "./Logo.css";
//components
import NotificationCard from "./NotificationCard";
//@MUI
import { List, Popover, Typography } from "@mui/material";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/AuctionList.json";
//useContext
import Web3Context from "../../Web3Context";

/**
 * Notification list that appears on click on notification icon button
 * Contains Notification item cards
 * @param {string[]} auctionAddressList - list of existing auction addresses fetched from blockchain network
 * @param {number} id - id of popover : "simple-popover"
 * @param {boolean} open - bool that controls the state of popover if it's open or close
 * @param {number} anchorEl
 * @param {function} onClose - AnchorElNotificationSetter
 */
function Notifications({ id, open, anchorEl, onClose }) {
  const context = useContext(Web3Context);
  const { projectUrl, auctionAddressList } = context;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        {typeof auctionAddressList !== "undefined" &&
          auctionAddressList.map((address, index) => (
            <NotificationCard key={index} address={address} />
          ))}
      </List>
    </Popover>
  );
}

export default Notifications;
