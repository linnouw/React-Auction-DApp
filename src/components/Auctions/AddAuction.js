import React from "react";
//styles
import "./Auctions.css";
//@MUI
import {
  Typography,
  Stack,
  Modal,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
//@Icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";

function AddAuction(props) {
  return (
    <Modal open={props.open} onClose={props.closeModal}>
      <Box className="modal-box" p={3}>
        <Typography variant="h6">Add a new auction</Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          p={2}
        >
          <TextField id="outlined-basic" label="Name" variant="outlined" />

          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
          p={2}
        >
          <TextField
            id="outlined-basic"
            label="Starting price"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
          />

          <TextField
            id="outlined-basic"
            label="Auction duration"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">H</InputAdornment>,
            }}
          />

          <TextField
            id="outlined-basic"
            label="Min-increment"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          p={2}
        >
          <button className="modal-button" onClick={props.closeModal}>
            <Stack direction="row">
              <KeyboardBackspaceIcon />
              <Typography>Cancel</Typography>
            </Stack>
          </button>

          <button className="modal-button">
            <Stack direction="row">
              <SaveIcon />
              <Typography>Save</Typography>
            </Stack>
          </button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default AddAuction;
