import React, { useContext } from "react";
//components
import AuctionList from "./AuctionList";
import AddAuction from "./AddAuction";
//styles
import "./Auctions.css";
//@MUI
import { Grid, Typography, Stack } from "@mui/material";
//@Icons
import AddIcon from "@mui/icons-material/Add";
//@useContext
import Web3Context from "../../Web3Context";

/**
 * contains two components : add list button & started auction cards
 */
function Auctions() {
  const context = useContext(Web3Context);
  const { auctionAddressList } = context;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid container className="auctions-box">
      <button className="auction-button" onClick={handleOpen}>
        <Stack direction="row">
          <AddIcon />
          <Typography
            className="typo-button"
            onClick={() => console.log(auctionAddressList)}
          >
            Add a new auction
          </Typography>
        </Stack>
      </button>
      <AddAuction open={open} closeModal={handleClose} />

      <Grid item container direction={{ xs: "column", md: "row" }}>
        {typeof auctionAddressList !== "undefined" &&
          auctionAddressList.map((address, index) => (
            <AuctionList address={address} key={index} />
          ))}
      </Grid>
    </Grid>
  );
}

export default Auctions;
