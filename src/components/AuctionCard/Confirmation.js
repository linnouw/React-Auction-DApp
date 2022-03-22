import React from "react";
//styles
import "./AuctionCard.css";
//@MUI
import { Typography, Grid, Modal, Box, Stack } from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CheckIcon from "@mui/icons-material/Check";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../wallet/Connect";

function Confirmation(props) {
  const { active, account, library, activate, deactivate } = useWeb3React();

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

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
            <Typography>Connected wallet: {account}</Typography>
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
                <button className="modal-button">
                  <Stack direction="row">
                    <AttachMoneyIcon />
                    <Typography>Pay</Typography>
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
