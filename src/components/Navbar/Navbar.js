import React from "react";
//components
import Dashboard from "../Dashboard/Dashboard";
import Auctions from "../Auctions/Auctions";
import Bids from "../Bids/Bids";
import Offers from "../Offers/Offers";
//styles
import "./Navbar.css";
//@MUI
import { Box } from "@mui/material";
//@Icons

function Navbar() {
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box className="navbar-box">
        <button className="navbar-button" onClick={() => handleChange(0)}>
          Dashboard
        </button>
        <button className="navbar-button" onClick={() => handleChange(1)}>
          Auctions
        </button>
        <button className="navbar-button" onClick={() => handleChange(2)}>
          Bids
        </button>
        <button className="navbar-button" onClick={() => handleChange(3)}>
          Offers
        </button>
      </Box>
      <Box
        className="container"
        height="100vh"
        display="flex"
        flexDirection="column"
      >
        {value === 0 ? <Dashboard /> : <></>}
        {value === 1 ? <Auctions /> : <></>}
        {value === 2 ? <Bids /> : <></>}
        {value === 3 ? <Offers /> : <></>}
      </Box>
    </div>
  );
}

export default Navbar;
