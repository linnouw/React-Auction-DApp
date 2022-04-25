//styles
import React, { useEffect, useState, useContext } from "react";
import "./Logo.css";
//components
import Notifications from "./Notifications";
//@MUI
import {
  Box,
  IconButton,
  Grid,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Popover,
  Typography,
} from "@mui/material";
//@Icons
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotificationsIcon from "@mui/icons-material/Notifications";
//@useContext
import Web3Context from "../../Web3Context";

/**
 * Contains logo and notification, profile icon buttons
 */
function Logo() {
  const context = useContext(Web3Context);
  const { auctionAddressList } = context;
  //menu bar for profile
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //notification popover
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const openNotification = Boolean(anchorElNotification);
  const idNotification = openNotification ? "simple-popover" : undefined;

  const handleClickNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  return (
    <Box className="logo-box">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <span class="app-logo">
            Trading Platform <sub>By AKKA</sub>
          </span>
        </Grid>
        <Grid item>
          <IconButton onClick={handleClickNotification}>
            <Badge color="error" variant="dot">
              <NotificationsIcon className="icon" />
            </Badge>
          </IconButton>
          <Tooltip title="Manage my profile">
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <AssignmentIndIcon className="icon" />
            </IconButton>
          </Tooltip>
        </Grid>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>My profile</MenuItem>
        </Menu>
        <Notifications
          id={idNotification}
          open={openNotification}
          anchorEl={anchorElNotification}
          onClose={handleCloseNotification}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        />
      </Grid>
    </Box>
  );
}

export default Logo;
