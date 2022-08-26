import React, { useState, useEffect, useContext } from "react";
//styles
import "./Bids.css";
//@MUI
import { Grid, Box, Typography, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import my_auction_contract from "../../abi/MyAuction.json";
//@useContext
import Web3Context from "../../Web3Context";
import ReactLoading from "react-loading";

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

/**
 *returns a table with all the bids happened and display information about the auction (state, name, highest bidder, highest bid).
 *returns bid of the connected wallet.
 */
function Bids() {
  const context = useContext(Web3Context);
  const { auctionAddressList, projectUrl } = context;

  const [searchTerm, setSearchTerm] = React.useState("");
  const { account } = useWeb3React();
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getAuctionParameters = async (address) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
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

  async function load() {
    const bidRows = await Promise.all(
      auctionAddressList.map(async (address) => {
        return await getAuctionParameters(address);
      })
    );

    setRows(bidRows);
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, [rows]);

  const filteredRows = rows.filter(
    (row) =>
      row.name.includes(searchTerm) ||
      row.name.toLowerCase().includes(searchTerm)
  );

  return (
    <>
      {!loaded ? (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          mt={5}
        >
          <ReactLoading
            type={"spin"}
            color={"#a0a0a0"}
            height={50}
            width={50}
          />
        </Grid>
      ) : (
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
            <div style={{ height: 850, width: "100%" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Bids;
