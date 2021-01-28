import React, { ReactElement } from "react";
import { Doughnut } from "react-chartjs-2";

type CapacityProps = {
    totalPolkaBTC: number;
    capacity: number;
    collateralizationRate?: string;
};

export default function CapacityDoughnut({
    totalPolkaBTC,
    capacity,
    collateralizationRate,
}: CapacityProps): ReactElement {
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
