import React, { useState, useEffect } from "react";
//styles
import "./Auctions.css";
//@MUI
import {
  Typography,
  Stack,
  Modal,
  Box,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../wallet/Connect";

function AddAuction(props) {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [startingPrice, setStartingPrice] = useState(null);
  const [minIncrement, setMinIncrement] = useState(null);
  const [auctionDuration, setAuctionDuration] = useState(null);
  const { active, account, library, activate, deactivate } = useWeb3React();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name !== null &&
      description !== null &&
      startingPrice !== null &&
      minIncrement !== null &&
      auctionDuration !== null
    ) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:7545")
      );
      const networkId = await web3.eth.net.getId();
      const AuctionListContract = new web3.eth.Contract(
        auction_list_contract.abi,
        auction_list_contract.networks[networkId].address
      );

      await AuctionListContract.methods
        .createAuctions(
          account,
          name,
          description,
          parseInt(startingPrice),
          parseInt(auctionDuration),
          parseInt(minIncrement)
        )
        .send({ from: account, value: "100000", gas: "2233593" })
        .then(() => alert("successfully added"))
        .catch((err) => alert(err));
    } else alert("Error ! all the fields are required to add an auction.");
  };

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
        <Typography variant="h6">
          To add a new auction, you have to be connected to your wallet
        </Typography>
        {active ? (
          <Typography className="auction-owner">
            Connected wallet: {account}
          </Typography>
        ) : (
          <></>
        )}
        {active ? (
          <>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              p={2}
            >
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
              p={2}
            >
              <TextField
                id="outlined-basic"
                label="Starting price"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                onChange={(e) => setStartingPrice(e.target.value)}
              />

              <TextField
                id="outlined-basic"
                label="Auction duration"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">H</InputAdornment>
                  ),
                }}
                onChange={(e) => setAuctionDuration(e.target.value)}
              />

              <TextField
                id="outlined-basic"
                label="Min-increment"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                onChange={(e) => setMinIncrement(e.target.value)}
              />
            </Stack>
          </>
        ) : (
          <></>
        )}
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          p={2}
        >
          <button className="modal-button" onClick={props.closeModal}>
            <Stack direction="row">
              <KeyboardBackspaceIcon />
              <Typography>Cancel</Typography>
            </Stack>
          </button>

          {active ? (
            <>
              <button className="modal-button" onClick={handleSubmit}>
                <Stack direction="row">
                  <SaveIcon />
                  <Typography>Save</Typography>
                </Stack>
              </button>
            </>
          ) : (
            <button className="modal-button" onClick={connect}>
              <Stack direction="row">
                <CheckIcon />
                <Typography>Connect</Typography>
              </Stack>
            </button>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddAuction;
