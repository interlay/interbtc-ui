import React, { useEffect, ReactElement, useState, useMemo } from "react";
import { Line, LinearComponentProps } from "react-chartjs-2";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { planckToDOT } from "@interlay/polkabtc";

const CollateralLocked = (): ReactElement => {
    const totalLockedDOT = useSelector((state: StoreType) => state.general.totalLockedDOT);
    const { prices } = useSelector((state: StoreType) => state.general);

    const statsApi = usePolkabtcStats();

    const [chartProps, setChartProps] = useState({} as LinearComponentProps);
    const [cumulativeCollateralPerDay, setCumulativeCollateralPerDay] = useState(
        new Array<{ date: number; amount: number }>()
    );
    const pointCollateralPerDay = useMemo(
        () =>
            cumulativeCollateralPerDay.map((dataPoint, i) => {
                if (i === 0) return 0;
                return dataPoint.amount - cumulativeCollateralPerDay[i - 1].amount;
            }),
        [cumulativeCollateralPerDay]
    );

    const fetchCollateralLastDays = useMemo(
        () => async () => {
            const res = await statsApi.getRecentDailyCollateralLocked(6);
            setCumulativeCollateralPerDay(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        fetchCollateralLastDays();
    }, [fetchCollateralLastDays]);

    useEffect(() => {
        const totalCollateralData = {
            label: "Total Collateral issued",
            yAxisID: "left-y-axis",
            fill: false,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: getAccents("d_pink").colour,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: getAccents("d_pink").colour,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: getAccents("d_pink").colour,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: cumulativeCollateralPerDay.map((dataPoint) => planckToDOT(dataPoint.amount.toString())),
        };
        const perDayCollateralData = {
            label: "Collateral issued today",
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
            data: pointCollateralPerDay.map((amount) => planckToDOT(amount.toString())),
        };
        const data = {
            labels: cumulativeCollateralPerDay.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString()),
            datasets: [totalCollateralData, perDayCollateralData],
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
    }, [cumulativeCollateralPerDay, pointCollateralPerDay]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_pink").colour}` }}>Collateral Locked</h1>
                    <h2>{totalLockedDOT} DOT</h2>
                    <h2>${(prices.polkadot.usd * parseInt(totalLockedDOT)).toLocaleString()}</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent
                        buttonName="view all vaults"
                        propsButtonColor="d_pink"
                        buttonId="collateral-locked"
                    />
                </div>
            </div>
            <div className="chart-container">
                <Line {...chartProps} />
            </div>
        </div>
    );
};

export default CollateralLocked;
