import React, { useState, useEffect } from "react";
//styles
import "./Bids.css";
//@MUI
import { Grid, Box, Typography, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../wallet/Connect";
import my_auction_contract from "../../abi/MyAuction.json";
import { connected } from "process";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  {
    field: "name",
    headerName: "Name",
    flex: 3,
  },
  {
    field: "bid",
    headerName: "Your bids",
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
            </>
          ) : (
            <>
              <Typography>-</Typography>
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
    renderCell: (params) => {
      return (
        <>
          {params.value !== 0 ? (
            <>
              <Typography>{params.value} ETH</Typography>
            </>
          ) : (
            <>
              <Typography>-</Typography>
            </>
          )}
        </>
      );
    },
  },
  {
    field: "highestBidder",
    headerName: "Highest bidder",
    flex: 2,
    renderCell: (params) => {
      return (
        <>
          {params.value !== "0x0000000000000000000000000000000000000000" ? (
            <>
              <Typography>{params.value}</Typography>
            </>
          ) : (
            <>
              <Typography>-</Typography>
            </>
          )}
        </>
      );
    },
  },
  {
    field: "state",
    headerName: "State",
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
        {params.value - Math.round(new Date().getTime() / 1000) > 0 ? (
          <>
            <Typography className="auction-status-STARTED">STARTED</Typography>
            <Box className="status-dot-STARTED" />
          </>
        ) : (
          <>
            <Typography className="auction-status-OVER">OVER</Typography>
            <Box className="status-dot-OVER" />
          </>
        )}
      </Stack>
    ),
  },
];

function Bids() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [rows, setRows] = useState([]);

  const getAuctionParameters = async (address) => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const Auction = new web3.eth.Contract(my_auction_contract.abi, address);
    const event = await Auction.methods.returnContents().call();
    const eventHighestBidder = await Auction.methods.getHighestBidder().call();
    const auctionEnd = await Auction.methods.auctionEnd.call().call();
    const highestBid = await Auction.methods.highestBid.call().call();
    let bid = 0;
    if (account !== undefined) {
      bid = await Auction.methods.returnSenderBid(account).call();
    }

    return {
      id: address,
      name: event[1],
      bid: bid * Math.pow(10, -18),
      highestBid: highestBid * Math.pow(10, -18),
      highestBidder: eventHighestBidder,
      state: auctionEnd,
    };
  };

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

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

      const bidRows = await Promise.all(
        auctions.map(async (address) => {
          return await getAuctionParameters(address);
        })
      );

      setRows(bidRows);
    }

    load();
  });

  const filteredRows = rows.filter((row) => row.name.includes(searchTerm));

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
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
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
