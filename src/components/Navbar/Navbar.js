import React from "react";
//styles
import "./Navbar.css";
//@MUI
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
/**
 * contains buttons that redirects to dashboard, auctions, bids pages
 */
function Navbar() {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Box className="navbar-box">
        <button
          className="navbar-button"
          onClick={() => {
            routeChange("/");
          }}
        >
          Dashboard
        </button>
        <button
          className="navbar-button"
          onClick={() => {
            routeChange("/auctions");
          }}
        >
          Auctions
        </button>
        <button
          className="navbar-button"
          onClick={() => {
            routeChange("/bids");
          }}
        >
          Bids
        </button>
      </Box>
    </div>
  );
}

export default Navbar;
