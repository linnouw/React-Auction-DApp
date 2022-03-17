import React from "react";
//components
import AuctionCard from "../AuctionCard/AuctionCard";
import AddAuction from "./AddAuction";
//styles
import "./Auctions.css";
//@MUI
import { Grid, Typography, Stack } from "@mui/material";
//@Icons
import AddIcon from "@mui/icons-material/Add";

const dummyItems = {
  product: "a car",
  name: "Tesla",
  description: "Tesla",
  startingPrice: "4",
  minIncrement: "5",
  duration: "2h",
  status: "Started",
};

function Auctions() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid className="auctions-box">
      <button className="auction-button" onClick={handleOpen}>
        <Stack direction="row">
          <AddIcon />
          <Typography className="typo-button">Add a new auction</Typography>
        </Stack>
      </button>

      <AddAuction open={open} closeModal={handleClose} />

      <AuctionCard items={dummyItems} />
    </Grid>
  );
}

export default Auctions;
