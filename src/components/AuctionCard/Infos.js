import React, { useState, useEffect, useContext } from "react";
//styles
import "./AuctionCard.css";
//@MUI
import { Modal, Box, Grid, Stack, Typography } from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

function Infos({ ipfsUrl, openInfos, closeModalInfos }) {
  return (
    <Modal open={openInfos} onClose={closeModalInfos}>
      <Box className="modal-box" p={3}>
        <Grid
          container
          direction="column"
          justifyContent={{ md: "flex-start", xs: "center" }}
          alignItems="center"
          p={2}
        >
          {ipfsUrl && <img alt={"no pictures"} src={ipfsUrl} width="600px" />}
        </Grid>
        <Grid container direction="row" justifyContent="center" p={2}>
          <button className="modal-button" onClick={closeModalInfos}>
            <Stack direction="row">
              <KeyboardBackspaceIcon />
            </Stack>
          </button>
        </Grid>
      </Box>
    </Modal>
  );
}

export default Infos;
