//styles
import React from "react";
import "./Logo.css";
//@MUI
import { Box, IconButton, Grid, Tooltip, Menu, MenuItem } from "@mui/material";
//@Icons
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FeedbackIcon from "@mui/icons-material/Feedback";

function Logo() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          <Tooltip title="Create a feedback">
            <IconButton>
              <FeedbackIcon className="icon" />
            </IconButton>
          </Tooltip>
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
      </Grid>
    </Box>
  );
}

export default Logo;
