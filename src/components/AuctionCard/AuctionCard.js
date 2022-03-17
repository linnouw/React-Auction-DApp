import React from "react";
//components
import Confirmation from "./Confirmation";
//styles
import "./AuctionCard.css";
//@MUI
import {
  Card,
  Typography,
  Grid,
  Button,
  CardContent,
  CardActions,
  Box,
  Stack,
} from "@mui/material";

function AuctionCard(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Card sx={{ maxWidth: 300 }} className="auction-card">
        <CardContent>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className="auction-timer">00:00:00</Typography>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {props.items.status === "Started" ? (
                <>
                  <Typography className="auction-status-STARTED">
                    {props.items.status}
                  </Typography>
                  <Box className="status-dot-STARTED" />
                </>
              ) : (
                <></>
              )}
              {props.items.status === "Over" ? (
                <>
                  <Typography className="auction-status-OVER">
                    {props.items.status}
                  </Typography>
                  <Box className="status-dot-OVER" />
                </>
              ) : (
                <></>
              )}
              {props.items.status === "Cancelled" ? (
                <>
                  <Typography className="auction-status-CANCELLED">
                    {props.items.status}
                  </Typography>
                  <Box className="status-dot-CANCELLED" />
                </>
              ) : (
                <></>
              )}
            </Stack>
          </Grid>
          <Typography variant="h6">{props.items.product}</Typography>
          <Typography variant="h6">{props.items.name}</Typography>
          <Typography className="auction-description">
            {props.items.description}
          </Typography>
          <Typography>Starting price: {props.items.startingPrice}$</Typography>
          <Typography>Min increment: {props.items.minIncrement}$</Typography>
          <Typography>Auction duration: {props.items.duration}h</Typography>
        </CardContent>
        <CardActions>
          <Grid container direction="row">
            <Button variant="text" onClick={handleOpen}>
              Bid on
            </Button>
            <Button variant="text">Ignore</Button>
          </Grid>
        </CardActions>
      </Card>
      <Confirmation open={open} closeModal={handleClose} />
    </div>
  );
}

export default AuctionCard;
