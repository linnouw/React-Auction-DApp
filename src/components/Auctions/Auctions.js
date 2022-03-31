import React, { useState, useEffect } from "react";
//components
import AuctionCard from "../AuctionCard/AuctionCard";
import AddAuction from "./AddAuction";
//styles
import "./Auctions.css";
//@MUI
import { Grid, Typography, Stack } from "@mui/material";
//@Icons
import AddIcon from "@mui/icons-material/Add";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";

function Auctions() {
  const [open, setOpen] = React.useState(false);
  const [auctionAddressList, setAuctionAddressList] = useState(); //store auction list
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //get auctions from AuctionList smart contract
  useEffect(() => {
    async function load() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:7545")
      );
      const networkId = await web3.eth.net.getId();
      const AuctionListContract = new web3.eth.Contract(
        auction_list_contract.abi,
        auction_list_contract.networks[networkId].address
      );

      const auctions = await AuctionListContract.methods
        .getAllAuctions()
        .call();
      setAuctionAddressList(auctions);
    }

    load();
  });

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

      <Grid item container>
        {typeof auctionAddressList === "undefined" ? (
          <></>
        ) : (
          auctionAddressList.map((address, index) => (
            <Grid item xs={3}>
              <AuctionCard key={index} address={address} />
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
}

export default Auctions;
