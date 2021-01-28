import React from "react";
import { Line } from "react-chartjs-2";
import { getAccents } from "../dashboardcolors";

export interface ChartProps {
    chartId: string;
    colour: string;
    label: string;
    chartData: { date: number; amount: number }[];
}
const SingleAxisChartComponent = (props: ChartProps): React.ReactElement => {
    const data = {
        labels: props.chartData.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString()),
        datasets: [
            {
                label: props.label,
                fill: false,
                borderColor: getAccents(props.colour).colour,
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: getAccents(props.colour).colour,
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: getAccents(props.colour).colour,
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: props.chartData.map((dataPoint) => dataPoint.amount),
            },
        ],
    };

    const chartProps = {
        data,
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
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                        type: "linear",
                        display: true,
                        position: "left",
                    },
                ],
            },
        },
    };
    return (
        <div className="chart-container">
            <Line {...chartProps} />
        </div>
    );
};

export default SingleAxisChartComponent;
