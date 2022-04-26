import React, { useState, useContext, useEffect } from "react";
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
  Grid,
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
//useContext
import Web3Context from "../../Web3Context";

/**
 * Modal contains form to create an auction.
 * @param {boolean} open - state of the modal: closed or open
 * @param {function} closeModal - open setter
 * @returns
 */
function AddAuction({ open, closeModal }) {
  const context = useContext(Web3Context);
  const { infuraProject } = context;
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [startingPrice, setStartingPrice] = useState(null);
  const [minIncrement, setMinIncrement] = useState(null);
  const [auctionDuration, setAuctionDuration] = useState(null);
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [privateKey, setPrivateKey] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name &&
      description &&
      startingPrice &&
      minIncrement &&
      auctionDuration
    ) {
      const web3 = new Web3(new Web3.providers.HttpProvider(infuraProject));
      const networkId = await web3.eth.net.getId();
      const AuctionListContract = new web3.eth.Contract(
        auction_list_contract.abi,
        auction_list_contract.networks[networkId].address
      );

      web3.eth.accounts.wallet.add(privateKey);

      const gas = await AuctionListContract.methods
        .createAuctions(
          account,
          name,
          description,
          parseInt(startingPrice),
          parseInt(auctionDuration),
          parseInt(minIncrement)
        )
        .estimateGas();

      const data = await AuctionListContract.methods
        .createAuctions(
          account,
          name,
          description,
          parseInt(startingPrice),
          parseInt(auctionDuration),
          parseInt(minIncrement)
        )
        .send({ from: account, gas })
        .then(() => alert("successfully added"))
        .catch((err) => alert(err));

      //sign Tx
      const txData = {
        from: account,
        to: auction_list_contract.options.address,
        data,
        chain: "rinkeby",
      };
      const receipt = await web3.eth.sendTransaction(txData);
      console.log(receipt.transactionHash);
    } else alert("Error ! all the fields are required to add an auction.");
  };

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  const decreaseDuration = () => {
    if (auctionDuration <= 0) {
      setAuctionDuration(0);
    } else {
      setAuctionDuration(auctionDuration - 1);
    }
  };

  const increaseDuration = () => {
    setAuctionDuration(auctionDuration + 1);
  };

  const onChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 0) {
      setAuctionDuration(value);
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
                label="Enter your private key to validate"
                variant="outlined"
                onChange={(e) => setPrivateKey(e.target.value)}
              />
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
                    <InputAdornment position="end">ETH</InputAdornment>
                  ),
                }}
                onChange={(e) => setStartingPrice(e.target.value)}
              />

              <TextField
                id="outlined-basic"
                value={auctionDuration}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <>
                      <InputAdornment position="end">MIN</InputAdornment>
                      <Grid direction="column" pl={1}>
                        <button
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={increaseDuration}
                        >
                          +
                        </button>
                        <button
                          style={{ width: "20px", height: "20px" }}
                          onClick={decreaseDuration}
                        >
                          -
                        </button>
                      </Grid>
                    </>
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
