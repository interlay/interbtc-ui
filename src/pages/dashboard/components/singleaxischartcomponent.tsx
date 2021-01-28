import React, { useEffect } from "react";
import { getAccents } from "../dashboardcolors";

export interface ChartProps {
    chartId: string;
    colour: string;
    label: string;
    chartData: number[];
}
const SingleAxisChartComponent = (props: ChartProps): React.ReactElement => {
    useEffect(() => {
        // eslint-disable-next-line
        const Chart = require("chart.js");
        const daysElement = document.getElementById(`${props.chartId}`) as HTMLCanvasElement;
        const ctx = daysElement.getContext("2d");

        const data = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Active Vaults",
                    fill: false,
                    borderColor: `${getAccents(`${props.colour}`).colour}`,
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: `${getAccents(`${props.colour}`).colour}`,
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: `${getAccents(`${props.colour}`).colour}`,
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: props.chartData,
                },
            ],
        };
        new Chart(ctx, {
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
    });
    return (
        <div className="chart-container">
            <canvas id={`${props.chartId}`}></canvas>
        </div>
    );
};

export default SingleAxisChartComponent;
