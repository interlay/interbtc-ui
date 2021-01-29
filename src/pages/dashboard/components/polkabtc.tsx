import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { satToBTC } from "@interlay/polkabtc";
import LineChartComponent from "./line-chart-component";

type PolkaBTCProps = {
    chartOnly?: boolean;
};

const PolkaBTC = ({ chartOnly }: PolkaBTCProps): React.ReactElement => {
    const totalPolkaBTC = useSelector((state: StoreType) => state.general.totalPolkaBTC);

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
    }, [fetchIssuesLastDays]);

    return (
        <div className="card">
            {!chartOnly ? (
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
            ) : (
                ""
            )}
            <div className="chart-container">
                <LineChartComponent
                    colour={["d_yellow", "d_grey"]}
                    label={["Total PolkaBTC issued", "PolkaBTC issued today"]}
                    yLabels={cumulativeIssuesPerDay.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString())}
                    yAxisProps={[{ beginAtZero: true, position: "left" }, { position: "right" }]}
                    data={[
                        cumulativeIssuesPerDay.map((dataPoint) => Number(satToBTC(dataPoint.sat.toString()))),
                        pointIssuesPerDay.map((sat) => Number(satToBTC(sat.toString()))),
                    ]}
                />
            </div>
        </div>
    );
};

export default PolkaBTC;
