import React, { useContext, useState, useEffect } from "react";
//styles
import "./Dashboard.css";
//components
import Stat from "./Stat";
import Stat2 from "./Stat2";
//@MUI
import { Grid, Typography } from "@mui/material";
//@MUI icons
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import StarIcon from "@mui/icons-material/Star";
//web3
import Web3 from "web3";
import auction_list_contract from "../../abi/AuctionList.json";
//useContext
import Web3Context from "../../Web3Context";
//react loading
import ReactLoading from "react-loading";

function Dashboard() {
  const context = useContext(Web3Context);
  const { auctionAddressList, projectUrl } = context;

  const locale = "en";
  const today = new Date();
  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;
  const totalAuctions =
    typeof auctionAddressList !== "undefined" && auctionAddressList.length;

  const [labels, setLabels] = useState();
  const [doughnutData, setDoughnutData] = useState();
  const [barData, setBarData] = useState();
  const [lowStartPrice, setLowStartPrice] = useState();
  const [newOwner, setNewOwner] = useState();
  const [loaded, setLoaded] = useState(false);

  async function load() {
    const web3 = new Web3(new Web3.providers.HttpProvider(projectUrl));
    const networkId = await web3.eth.net.getId();
    const AuctionListContract = new web3.eth.Contract(
      auction_list_contract.abi,
      auction_list_contract.networks[networkId].address
    );

    const auctions = await AuctionListContract.methods
      .getAllAuctionDetails()
      .call();

    if (typeof auctions !== "undefined") {
      //Set labels
      const auctionsName = auctions.map((auction) => auction[1].toLowerCase());

      //Set doughnutLabels from auction names
      const names = [...new Set(auctionsName)];
      setLabels(names);

      //Set Data for doughnut chart
      let count = [];
      for (const item of names) {
        count.push(auctionsName.filter((element) => element === item).length);
      }
      setDoughnutData(count);

      //Set Data for bar chart
      let average = [];
      for (const item of names) {
        const elements = auctions.filter((element) => element[1] === item);
        const prices = elements.map((price) => parseInt(price[3]));
        const sum = prices.reduce(
          (prevValue, initValue) => prevValue + initValue
        );
        average.push(sum / prices.length);
      }
      setBarData(average);

      //Set lowest starting price
      const startingPrices = auctions.map((element) => parseInt(element[3]));
      const low = Math.min(...startingPrices);
      setLowStartPrice(low);

      //Set auction owner
      const owner = auctions[auctions.length - 1][0];
      setNewOwner(owner);
    }
    setLoaded(true);
  }

  useEffect(() => {
    load();
  });
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
        <>
          <Grid container className="calendar-box">
            <CalendarTodayIcon />
            <Typography className="date">{date}</Typography>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            p={2}
          >
            <Grid item xs={12} md={4}>
              <Grid p={2}>
                <Grid item container>
                  <Typography variant="h6" className="card-title">
                    Total auctions
                  </Typography>
                </Grid>

                <Grid item container>
                  <InsertChartIcon className="stat-icons" />
                  <Typography variant="h4">{totalAuctions}</Typography>
                </Grid>
              </Grid>
              <Grid p={2}>
                <Grid item container>
                  <Typography variant="h6" className="card-title">
                    Lowest starting price
                  </Typography>
                </Grid>

                <Grid item container>
                  <ArrowDownwardIcon className="stat-icons" />
                  <Typography variant="h4">{lowStartPrice}</Typography>
                </Grid>
              </Grid>
              <Grid p={2}>
                <Grid item container>
                  <Typography variant="h6" className="card-title">
                    Newest auction owner
                  </Typography>
                </Grid>

                <Grid item container>
                  <StarIcon className="stat-icons" />
                  <Typography variant="h8">{newOwner}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stat doughnutData={doughnutData} labels={labels} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stat2 barData={barData} labels={labels} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default Dashboard;
