import React, { useState, useContext, useEffect } from "react";
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
//useContext
import Web3Context from "../../Web3Context";

/**
 * Modal for bid confirmation: connect to wallet and enter amount of bid.
 * @param {string} address - address of a specific auction
 * @param {string} owner - address of the auction owner
 * @param {boolean} open - state of the modal: open/closed
 * @param {function} closeModal - open setter
 * @returns
 */
function Confirmation({ address, owner, open, closeModal }) {
  const context = useContext(Web3Context);
  const { projectUrl } = context;
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [amountValue, setAmountValue] = useState(null);
  const [privateKey, setPrivateKey] = useState();
  const [balance, getBalance] = useState();

  const getAccountBalance = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
    const accountBalance = await web3.eth.getBalance(
      account,
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(web3.utils.fromWei(result, "ether") + " ETH");
        }
      }
    );
    const accountBalanceInEther =
      web3.utils.fromWei(accountBalance, "ether") + " ETH";
    getBalance(accountBalanceInEther);
  };

  useEffect(() => {
    getAccountBalance();
  }, [account]);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (owner !== account) {
      if (amountValue !== null) {
        const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
        const Auction = new web3.eth.Contract(my_auction_contract.abi, address);

        await Auction.methods
          .bid()
          .send({
            from: account,
            to: address,
            value: web3.utils.toWei(amountValue, "ether"),
            gas: "3000000",
          })
          .then(() => alert("Submitted"))
          .catch((error) => alert(error));
        window.location.reload(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <Box className="modal-box" p={3}>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          {account !== owner ? (
            <>
              <Typography variant="h6">
                You are about to bid on this auction
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6">
                You can't bid on your own auction
              </Typography>
            </>
          )}
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
              <Typography className="auction-owner">
                Account Balance: {balance}
              </Typography>
              {account !== owner && (
                <TextField
                  label="Insert amount to bid"
                  variant="standard"
                  onChange={(e) => setAmountValue(e.target.value)}
                />
              )}
            </>
          ) : (
            <Typography>Connect to your cryptowallet</Typography>
          )}
          <Grid container direction="row" justifyContent="center" p={2}>
            <Grid item p={1}>
              <button className="modal-button" onClick={closeModal}>
                <Stack direction="row">
                  <KeyboardBackspaceIcon />
                  <Typography>Cancel</Typography>
                </Stack>
              </button>
            </Grid>
            {active ? (
              <Grid item p={1}>
                {account !== owner && (
                  <button className="modal-button" onClick={handleSubmit}>
                    <Stack direction="row">
                      <AttachMoneyIcon />
                      <Typography>Bid</Typography>
                    </Stack>
                  </button>
                )}
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
        </Grid>
      </Box>
    </Modal>
  );
}

export default Confirmation;
