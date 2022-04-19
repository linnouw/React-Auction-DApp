import React, { useState, useEffect } from "react";
//styles
import "./Logo.css";
//components
import NotificationCard from "./NotificationCard";
//@MUI
import { List, Popover, Typography } from "@mui/material";

/**
 * Notification list that appears on click on notification icon button
 * Contains Notification item cards
 * @param {string[]} auctionAddressList - list of existing auction addresses fetched from blockchain network
 * @param {number} id - id of popover : "simple-popover"
 * @param {boolean} open - bool that controls the state of popover if it's open or close
 * @param {number} anchorEl
 * @param {function} onClose - AnchorElNotificationSetter
 * @returns
 */
function Notifications({ auctionAddressList, id, open, anchorEl, onClose }) {
  const auctionAddresses = auctionAddressList;

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
      {typeof auctionAddresses === "undefined" ? (
        <Typography>No Auction Results</Typography>
      ) : (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          {auctionAddresses.map((address) => {
            return <NotificationCard address={address} />;
          })}
        </List>
      )}
    </Popover>
  );
}

export default Notifications;
