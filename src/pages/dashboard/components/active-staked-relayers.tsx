import React, { ReactElement, useState, useMemo, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboard-colors";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import LineChartComponent from "./line-chart-component";
import { useTranslation } from "react-i18next";

type ActiveStakedRelayers = {
    linkButton?: boolean;
};

const ActiveStakedRelayers = ({ linkButton }: ActiveStakedRelayers): ReactElement => {
    const statsApi = usePolkabtcStats();
    const { t } = useTranslation();

    const [totalRelayersPerDay, setTotalRelayersPerDay] = useState(new Array<{ date: number; count: number }>());
    const fetchRelayersPerDay = useMemo(
        () => async () => {
            const res = await statsApi.getRecentDailyVaultCounts();
            setTotalRelayersPerDay(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        fetchRelayersPerDay();
    }, [fetchRelayersPerDay]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ color: getAccents("d_orange").color }}>{t("dashboard.parachain.active_relayers")}</h1>
                    <h2>{totalRelayersPerDay[totalRelayersPerDay.length - 1]?.count}</h2>
                </div>

                {linkButton ? (
                    <div className="button-container">
                        <ButtonComponent
                            buttonName="view relayers"
                            propsButtonColor="d_orange"
                            buttonId="active-staked"
                            buttonLink="/dashboard/parachain"
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
            <LineChartComponent
                color="d_orange"
                label={t("dashboard.parachain.total_relayers_chart") as string}
                yLabels={totalRelayersPerDay.map((dataPoint) => new Date(dataPoint.date).toLocaleDateString())}
                yAxisProps={{ beginAtZero: true, precision: 0 }}
                data={totalRelayersPerDay.map((dataPoint) => dataPoint.count)}
            />
        </div>
    );
};

export default ActiveStakedRelayers;
