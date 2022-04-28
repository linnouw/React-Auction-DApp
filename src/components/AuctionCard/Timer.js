import React from "react";
//@MUI
import { Typography } from "@mui/material";

/**
 * returns a countdown
 * @param {boolean} auctionEnd
 */
function Timer({ auctionEnd }) {
  const getCountdown = (end) => {
    if (end - Math.round(new Date().getTime() / 1000) > 0) {
      let time = end - Math.round(new Date().getTime() / 1000);
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time - hours * 3600) / 60);
      let seconds = time - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    }
  };

  return (
    <Typography className="auction-timer">
      {getCountdown(auctionEnd)}
    </Typography>
  );
}

export default Timer;
