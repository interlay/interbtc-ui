import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import { Line, LinearComponentProps } from "react-chartjs-2";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import {satToBTC} from "@interlay/polkabtc";

const PolkaBTC = (): React.ReactElement => {
    const totalPolkaBTC = useSelector((state: StoreType) => state.general.totalPolkaBTC);

    const statsApi = usePolkabtcStats();

    const [chartProps, setChartProps] = useState({} as LinearComponentProps);

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
    }, [fetchIssuesLastDays]);

    useEffect(() => {
        const totalIssuedData = {
            label: "Total PolkaBTC issued",
            yAxisID: "left-y-axis",
            fill: false,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: getAccents("d_yellow").colour,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: getAccents("d_yellow").colour,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: getAccents("d_yellow").colour,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: cumulativeIssuesPerDay.map((dataPoint) => satToBTC(dataPoint.sat.toString())),
        };
        const perDayIssuedData = {
            label: "PolkaBTC issued today",
            yAxisID: "right-y-axis",
            fill: false,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderColor: getAccents("d_grey").colour,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: getAccents("d_grey").colour,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: getAccents("d_grey").colour,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: pointIssuesPerDay.map((sat) => satToBTC(sat.toString())),
        };
        const data = {
            labels: cumulativeIssuesPerDay.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString()),
            datasets: [totalIssuedData, perDayIssuedData],
        };
        setChartProps({
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
                            id: "left-y-axis",
                        },
                        {
                            type: "linear",
                            display: true,
                            position: "right",
                            id: "right-y-axis",
                        },
                    ],
                },
            },
        });
    }, [cumulativeIssuesPerDay, pointIssuesPerDay]);

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_yellow").colour}` }}>Issued</h1>
                    <h2>{totalPolkaBTC} PolkaBTC</h2>
                    {/* TODO: add the price API */}
                    <h2>$17,0030</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all issued" propsButtonColor="d_yellow" />
                </div>
            </div>
            <div className="chart-container">
                <Line {...chartProps} />
            </div>
        </div>
    );
};

export default PolkaBTC;
