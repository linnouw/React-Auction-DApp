import React from "react";
//styles
import "./Bids.css";
//@MUI
import { Grid, Box, Typography, Stack, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

//dummy datas for now
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
              <Typography>{params.value}$</Typography>
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
    renderCell: (params) => <Typography>{params.value}$</Typography>,
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
        {params.value === "Started" ? (
          <>
            <Typography className="auction-status-STARTED">
              {params.value}
            </Typography>
            <Box className="status-dot-STARTED" />
          </>
        ) : (
          <></>
        )}
        {params.value === "Over" ? (
          <>
            <Typography className="auction-status-OVER">
              {params.value}
            </Typography>
            <Box className="status-dot-OVER" />
          </>
        ) : (
          <></>
        )}
        {params.value === "Cancelled" ? (
          <>
            <Typography className="auction-status-CANCELLED">
              {params.value}
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

function Bids() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredRows = dummyRows.filter((row) => row.name.includes(searchTerm));

  return (
    <Grid container direction="column">
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
      <Grid item p={2}>
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
