import React, { useState, useEffect } from "react";
//styles
import "./Bids.css";
//@MUI
import { Grid, Box, Typography, Stack, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/MyAuction.json";

const dummyRows = [
  {
    id: 1,
    name: "bmw",
    bid: 5,
    highestBid: 22,
    highestBidder: "linna",
    status: "Started",
  },
  {
    id: 2,
    name: "Tesla",
    bid: 0,
    highestBid: 55,
    highestBidder: "linna",
    status: "Cancelled",
  },
];

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "name",
    headerName: "Name",
    flex: 3,
  },
  {
    field: "bid",
    headerName: "Your bid",
    flex: 1,
    renderCell: (params) => {
      return (
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          {params.value !== 0 ? (
            <>
              <Typography>{params.value} ETH</Typography>
              <Button
                variant="contained"
                size="small"
                color="error"
                style={{
                  fontSize: "8px",
                  maxWidth: "50px",
                  maxHeight: "50px",
                  minWidth: "30px",
                  minHeight: "30px",
                }}
              >
                Withdraw
              </Button>
            </>
          ) : (
            <>
              <Typography>-</Typography>
              <Button
                variant="contained"
                size="small"
                color="success"
                style={{
                  fontSize: "8px",
                  maxWidth: "50px",
                  maxHeight: "50px",
                  minWidth: "30px",
                  minHeight: "30px",
                }}
              >
                Bid on
              </Button>
            </>
          )}
        </Stack>
      );
    },
  },
  {
    field: "highestBid",
    headerName: "Highest bid",
    flex: 1,
    renderCell: (params) => <Typography>{params.value} ETH</Typography>,
  },
  {
    field: "highestBidder",
    headerName: "Highest bidder",
    flex: 2,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => (
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="flex-end"
        alignItems="center"
        spacing={1}
      >
        {params.value === 0 ? (
          <>
            <Typography className="auction-status-STARTED">STARTED</Typography>
            <Box className="status-dot-STARTED" />
          </>
        ) : (
          <></>
        )}
        {params.value === 1 ? (
          <>
            <Typography className="auction-status-OVER">OVER</Typography>
            <Box className="status-dot-OVER" />
          </>
        ) : (
          <></>
        )}
        {params.value === 2 ? (
          <>
            <Typography className="auction-status-OVER">FINALISED</Typography>
            <Box className="status-dot-OVER" />
          </>
        ) : (
          <></>
        )}
        {params.value === 3 ? (
          <>
            <Typography className="auction-status-CANCELLED">
              CANCELLED
            </Typography>
            <Box className="status-dot-CANCELLED" />
          </>
        ) : (
          <></>
        )}
      </Stack>
    ),
  },
];

const getAuctionParameters = async (address) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545")
  );
  const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
  const event = await Auction.methods.returnContents().call();
  const eventHighestBidder = await Auction.methods.getHighestBidder().call();
  return {
    id: address,
    name: event[1],
    bid: 22,
    highestBid: 22,
    highestBidder: eventHighestBidder,
    status: event[7],
  };
};

function Bids() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [auctionAddress, setAuctionAddress] = useState([]);

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
      setAuctionAddress(auctions);
    }

    load();
  });

  const bidRows = auctionAddress.map((address) => {
    getAuctionParameters(address).then((result) => {
      console.log(result);
      return result;
    });
  });

  const filteredRows = dummyRows.filter((row) => row.name.includes(searchTerm));

  return (
    <Grid container direction="row">
      <Grid
        item
        p={2}
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <TextField
          id="outlined-basic"
          label="Enter name of a product"
          variant="outlined"
          className="bids-textfield"
          // onChange={(event) => {
          //   setSearchTerm(event.target.value);
          // }}
          onChange={() => console.log(bidRows)}
        />
      </Grid>
      <Grid item p={2} xs={12}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </Grid>
    </Grid>
  );
}

export default Bids;
