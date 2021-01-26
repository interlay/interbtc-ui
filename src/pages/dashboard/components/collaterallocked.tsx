import React, { useEffect } from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";

const collateralLocked = () => {
    useEffect(() => {
        var Chart = require("chart.js");
        let daysElement = document.getElementById("collateralLockedChart") as HTMLCanvasElement;
        var ctx = daysElement.getContext("2d");

        var totalIssuedData = {
            label: "Total Collateral issued",
            fill: false,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: `${getAccents("d_pink").colour}`,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: `${getAccents("d_pink").colour}`,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: `${getAccents("d_pink").colour}`,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [7, 6, 5, 4, 3, 2, 1],
        };
        var IssuedPerDayData = {
            label: "Collateral issued today",
            fill: false,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: `${getAccents("d_blue").colour}`,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: `${getAccents("d_blue").colour}`,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: `${getAccents("d_blue").colour}`,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [1, 2, 2, 2, 2, 2, 2],
        };
        var data = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [totalIssuedData, IssuedPerDayData],
        };
        var myChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    labels: {
                        fontSize: 9,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                },
            },
        });
    }, []);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1>Issued</h1>
                    <h2>232.4 PolkaBTC</h2>
                    <h2>$17,0030</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all issued" propsButtonColor="d_yellow" />
                </div>
            </div>
            <div className="chart-container">
                <canvas id="collateralLockedChart"></canvas>
            </div>
        </div>
    );
};

export default collateralLocked;
