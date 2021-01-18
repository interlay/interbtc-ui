import React, { useState, useEffect, ReactElement } from "react";
import VaultTable from "../../../common/components/vault-table/vault-table";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Line, Doughnut } from "react-chartjs-2";

import "./oracles.dashboard.page.scss";
import { StoreType } from "../../../common/types/util.types";

type TimeDataPoint = {
    x: Date;
    y: number;
};

type CapacityProps = {
    totalPolkaBTC: number;
    capacity: number;
    collateralizationRate?: string;
};

function CapacityDoughnut({ totalPolkaBTC, capacity, collateralizationRate }: CapacityProps): ReactElement {
    const chartProps = {
        data: {
            datasets: [
                {
                    data: [totalPolkaBTC, capacity],
                    backgroundColor: ["blue", "lightblue"],
                },
            ],
            labels: ["Existing PolkaBTC", "Capacity"],
        },
        options: {
            legend: {
                display: false,
            },
        },
    };
    return (
        <div className="row">
            <div className="col-md-8">
                <Doughnut {...chartProps} />
            </div>
            <div className="col-md-4">Collateralisation: {collateralizationRate} (target: 150%)</div>
        </div>
    );
}

type TimeChartProps = {
    title: string[];
    data: TimeDataPoint[];
};

function TimeChart(props: TimeChartProps): ReactElement {
    const chartProps = {
        data: {
            datasets: [
                {
                    label: "Total",
                    data: props.data,
                    fill: false,
                },
            ],
        },
        options: {
            title: {
                display: true,
                position: "top",
                text: props.title,
                fontSize: 24,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        type: "time",
                        time: {
                            round: "day",
                            unit: "day",
                        },
                    },
                ],
            },
        },
    };
    return <Line {...chartProps} />;
}

export default function VaultsDashboard(): ReactElement {
    const { polkaBtcLoaded, totalPolkaBTC, totalLockedDOT } = useSelector((state: StoreType) => state.general);
    const [capacity, setCapacity] = useState(0);
    const [collateralizationRate, setCollateralizationRate] = useState("∞");
    const { t } = useTranslation();

    const [activeVaults, setActiveVaults] = useState(new Array<TimeDataPoint>());
    const [collateralLocked, setCollateralLocked] = useState(new Array<TimeDataPoint>());
    const [feesEarned, setFeesEarned] = useState(new Array<TimeDataPoint>());

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const mockActiveVaults = Array.from({ length: 5 }).map((_, i) => ({
                x: new Date(Date.now() - 86400000 * (4 - i)),
                y: 40 + i,
            }));
            setActiveVaults(mockActiveVaults);

            const mockCollateralLocked = Array.from({ length: 5 }).map((_, i) => ({
                x: new Date(Date.now() - 86400000 * (4 - i)),
                y: Math.floor(12000000 + Math.random() * 10000),
            }));
            setCollateralLocked(mockCollateralLocked);

            const mockFeesEarned = Array.from({ length: 5 }).map((_, i) => ({
                x: new Date(Date.now() - 86400000 * (4 - i)),
                y: Math.floor(200 + Math.random() * i * i) / 10,
            }));
            setFeesEarned(mockFeesEarned);

            try {
                const collateralization = await window.polkaBTC.vaults.getSystemCollateralization();
                setCollateralizationRate(collateralization !== undefined ? collateralization.toString() : "∞");

                const issuablePolkaBTC = await window.polkaBTC.vaults.getIssuablePolkaBTC();
                setCapacity(Number(issuablePolkaBTC.toString()));
            } catch (_) {
                console.log(t("dashboard.error_unable_to_compute_collateral"));
            }
        };
        fetchData();
    }, [polkaBtcLoaded, totalLockedDOT, t]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("dashboard.dashboard")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <div className="col-md-6">
                                    <TimeChart
                                        data={activeVaults}
                                        title={[activeVaults[activeVaults.length - 1]?.y.toString(), "Active Vaults"]}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <CapacityDoughnut
                                        {...{ totalPolkaBTC: Number(totalPolkaBTC), collateralizationRate, capacity }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <TimeChart
                                        data={collateralLocked}
                                        title={(() => {
                                            const col = collateralLocked[collateralLocked.length - 1]?.y;
                                            return [
                                                "Collateral locked",
                                                `${col} DOT`,
                                                `$${Number(col * 10.13).toFixed()}`,
                                            ];
                                        })()}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <TimeChart
                                        data={feesEarned}
                                        title={(() => {
                                            const fees = feesEarned[feesEarned.length - 1]?.y;
                                            return ["Fees earned", `${fees} PolkaBTC`, `$${fees * 32000}`];
                                        })()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <VaultTable isRelayer={false}></VaultTable>
                </div>
            </div>
        </div>
    );
}
