import React, { useState, useContext } from "react";
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
} from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../wallet/Connect";
//useContext
import Web3Context from "../../Web3Context";
//ipfs
import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");
/**
 * Modal contains form to create an auction.
 * @param {boolean} open - state of the modal: closed or open
 * @param {function} closeModal - open setter
 * @returns
 */
function AddAuction({ open, closeModal }) {
  const context = useContext(Web3Context);
  const { projectUrl } = context;
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [startingPrice, setStartingPrice] = useState(null);
  const [minIncrement, setMinIncrement] = useState(null);
  const [auctionDuration, setAuctionDuration] = useState(null);
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [fileUrl, setFileUrl] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name &&
      description &&
      startingPrice &&
      minIncrement &&
      auctionDuration &&
      fileUrl
    ) {
      const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
      const networkId = await web3.eth.net.getId();
      const AuctionListContract = new web3.eth.Contract(
        auction_list_contract.abi,
        auction_list_contract.networks[networkId].address
      );

      const gas = await AuctionListContract.methods
        .createAuctions(
          account,
          name,
          description,
          parseInt(startingPrice),
          parseInt(auctionDuration),
          parseInt(minIncrement),
          fileUrl
        )
        .estimateGas({ from: account });

      const gasPrice = await web3.eth.getGasPrice();
      console.log(gasPrice);
      const tx = await AuctionListContract.methods
        .createAuctions(
          account,
          name,
          description,
          parseInt(startingPrice),
          parseInt(auctionDuration),
          parseInt(minIncrement),
          fileUrl
        )
        .send({ from: account, gas, gasPrice })
        .then((response) => alert("successfully added"))
        .catch((err) => alert(err));
      window.location.reload(false);
    } else alert("Error ! all the fields are required to add an auction.");
  };

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  const onChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0) {
      setAuctionDuration(value);
    }
  };

  const captureFile = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    const added = await client.add(file);
    try {
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log(fileUrl);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <Box className="modal-box" p={3}>
        {active ? (
          <Typography className="auction-owner">
            Connected wallet: {account}
          </Typography>
        ) : (
          <Typography variant="h6">
            To add a new auction, you have to be connected to your wallet
          </Typography>
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
              <input type="file" accept=".png, .jpeg" onChange={captureFile} />
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
                    <InputAdornment position="end">ETH</InputAdornment>
                  ),
                }}
                onChange={(e) => setStartingPrice(e.target.value)}
              />

              <TextField
                id="outlined-basic"
                type="number"
                value={auctionDuration}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">MIN</InputAdornment>
                  ),
                }}
                onChange={onChange}
              />

              <TextField
                id="outlined-basic"
                label="Min-increment"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">ETH</InputAdornment>
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
          <button className="modal-button" onClick={closeModal}>
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
