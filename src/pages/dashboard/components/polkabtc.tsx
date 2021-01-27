import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "./buttoncomponent";
import { getAccents } from "../dashboardcolors";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";

const PolkaBTC = (): React.ReactElement => {
    const statsApi = usePolkabtcStats();

    const [cumulativeIssuesPerDay, setCumulativeIssuesPerDay] = useState(new Array<{ date: number; sat: number }>());
    const pointIssuesPerDay = useMemo(
        () =>
            cumulativeIssuesPerDay.map((dataPoint, i) => {
                if (i === 0) return 0;
                return dataPoint.sat - cumulativeIssuesPerDay[i - 1].sat;
            }),
        [cumulativeIssuesPerDay]
    );

    const fetchIssuesLastDays = useMemo(
        () => async () => {
            const res = await statsApi.getRecentDailyIssues(6);
            setCumulativeIssuesPerDay(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        fetchIssuesLastDays();
        var Chart = require("chart.js");
        let daysElement = document.getElementById("polkaBTCChart") as HTMLCanvasElement;
        var ctx = daysElement.getContext("2d");
        var totalIssuedData = {
            label: "Total PolkaBTC issued",
            fill: false,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: `${getAccents("d_yellow").colour}`,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: `${getAccents("d_yellow").colour}`,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: `${getAccents("d_yellow").colour}`,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: cumulativeIssuesPerDay,
        };
        var IssuedPerDayData = {
            label: "PolkaBTC issued today",
            fill: false,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: `${getAccents("d_grey").colour}`,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: `${getAccents("d_grey").colour}`,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: `${getAccents("d_grey").colour}`,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: pointIssuesPerDay,
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
    }, [fetchIssuesLastDays]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_yellow").colour}` }}>Issued</h1>
                    <h2>232.4 PolkaBTC</h2>
                    <h2>$17,0030</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all issued" propsButtonColor="d_yellow" />
                </div>
            </div>
            <div className="chart-container">
                <canvas id="polkaBTCChart"></canvas>
            </div>
        </div>
    );
};

export default PolkaBTC;
