import React, { ReactElement, useState, useMemo, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import SingleAxisChartComponent from "./singleaxis-chart-component";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";

const ActiveVaults = (): ReactElement => {
    const statsApi = usePolkabtcStats();

    const [totalVaultsPerDay, setTotalVaultsPerDay] = useState(new Array<{ date: number; count: number }>());
    const fetchVaultsPerDay = useMemo(
        () => async () => {
            const res = await statsApi.getRecentDailyVaultCounts(6);
            setTotalVaultsPerDay(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        fetchVaultsPerDay();
    }, [fetchVaultsPerDay]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: `${getAccents("d_pink").colour}` }}>Active Vaults</h1>
                    <h2>{totalVaultsPerDay[totalVaultsPerDay.length - 1]?.count}</h2>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view all vaults" propsButtonColor="d_pink" buttonId="active-vaults" />
                </div>
            </div>
            <SingleAxisChartComponent
                chartId="active-vaults"
                colour="d_pink"
                label="Total active vaults"
                chartData={totalVaultsPerDay.map((dataPoint) => ({ date: dataPoint.date, amount: dataPoint.count }))}
            />
        </div>
    );
};

export default ActiveVaults;
