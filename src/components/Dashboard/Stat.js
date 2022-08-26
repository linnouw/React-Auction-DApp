import React, { useState, useEffect, useContext } from "react";
//styles
import "./Dashboard.css";
//@React chart
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
//@MUI
import { Paper, Typography } from "@mui/material";

function Stat({ doughnutData, labels }) {
  const datas = {
    datasets: [
      {
        data: doughnutData,
      },
    ],
    labels: labels,
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Auction Products",
      },
    },
  };

  return (
    <>
      <Paper style={{ padding: "20px" }}>
        {datas.length !== 0 ? (
          <>
            <Doughnut data={datas} options={options} width={500} height={500} />
          </>
        ) : (
          <>
            <Typography>No auctions</Typography>
          </>
        )}
      </Paper>
    </>
  );
}

export default Stat;
