import React, { useState, useEffect, useContext } from "react";
//styles
import "./Dashboard.css";
//@React chart
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
//@MUI
import { Paper, Typography } from "@mui/material";

function Stat({ barData, labels }) {
  const datas = {
    datasets: [
      {
        data: barData,
      },
    ],
    labels: labels,
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Average starting prices",
      },
    },
  };

  return (
    <>
      <Paper style={{ padding: "20px" }}>
        {datas.length !== 0 ? (
          <>
            <Bar data={datas} options={options} width={500} height={500} />
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
