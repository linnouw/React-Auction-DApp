import React from "react";
//styles
import "./AuctionCard.css";
//@MUI
import { Typography, Grid, Modal, Box, Stack } from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CheckIcon from "@mui/icons-material/Check";

function Confirmation(props) {
  return (
    <Modal open={props.open} onClose={props.closeModal}>
      <Box className="modal-box" p={3}>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          <Typography variant="h6">
            You are about to bid on this auction
          </Typography>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          <Typography>Connect to your cryptowallet</Typography>
          <Grid
            container
            direction="row"
            justifyContent={{ md: "flex-start", xs: "center" }}
            p={2}
          >
            <Grid item p={1}>
              <button className="modal-button" onClick={props.closeModal}>
                <Stack direction="row">
                  <KeyboardBackspaceIcon />
                  <Typography>Cancel</Typography>
                </Stack>
              </button>
            </Grid>
            <Grid item p={1}>
              <button className="modal-button">
                <Stack direction="row">
                  <CheckIcon />
                  <Typography>Confirm</Typography>
                </Stack>
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default Confirmation;
