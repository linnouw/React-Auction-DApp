import React, { useState } from "react";
//styles
import "./AuctionCard.css";
//@MUI
import { Typography, Grid, Modal, Box, Stack, TextField } from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CheckIcon from "@mui/icons-material/Check";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../wallet/Connect";
import my_auction_contract from "../../abi/MyAuction.json";

function Confirmation(props) {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [amountValue, setAmountValue] = useState(null);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.owner !== account) {
      if (amountValue !== null) {
        const web3 = new Web3(
          new Web3.providers.HttpProvider("http://localhost:7545")
        );
        const networkId = await web3.eth.net.getId();
        const Auction = new web3.eth.Contract(
          my_auction_contract.abi,
          props.address
        );
        await Auction.methods
          .bid()
          .send({
            from: account,
            to: props.address,
            value: web3.utils.toWei(amountValue, "ether"),
            gas: "2233593",
          })
          .then(() => alert("Submitted"))
          .catch((error) => alert(error));
      }
    }
  };

  return (
    <Modal open={props.open} onClose={props.closeModal}>
      <Box className="modal-box" p={3}>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          <Typography variant="h6">
            You are about to bid on this auction
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          {active ? (
            <>
              <Typography className="auction-owner">
                Connected wallet: {account}
              </Typography>
              <TextField
                label="Insert amount to bid"
                variant="standard"
                onChange={(e) => setAmountValue(e.target.value)}
              />
            </>
          ) : (
            <Typography>Connect to your cryptowallet</Typography>
          )}
          <Grid container direction="row" justifyContent="center" p={2}>
            <Grid item p={1}>
              <button className="modal-button" onClick={props.closeModal}>
                <Stack direction="row">
                  <KeyboardBackspaceIcon />
                  <Typography>Cancel</Typography>
                </Stack>
              </button>
            </Grid>
            {active ? (
              <Grid item p={1}>
                <button className="modal-button" onClick={handleSubmit}>
                  <Stack direction="row">
                    <AttachMoneyIcon />
                    <Typography>Bid</Typography>
                  </Stack>
                </button>
              </Grid>
            ) : (
              <Grid item p={1}>
                <button className="modal-button" onClick={connect}>
                  <Stack direction="row">
                    <CheckIcon />
                    <Typography>Connect</Typography>
                  </Stack>
                </button>
              </Grid>
            )}
          </Grid>
          <Grid></Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default Confirmation;
