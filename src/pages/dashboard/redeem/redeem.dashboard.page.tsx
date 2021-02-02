import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { StoreType } from "../../../common/types/util.types";
import { DashboardRequestInfo } from "../../../common/types/redeem.types";
import DashboardTable from "../../../common/components/dashboard-table/dashboard-table";
import { defaultTableDisplayParams } from "../../../common/utils/utils";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { satToBTC } from "@interlay/polkabtc";
import LineChartComponent from "../components/line-chart-component";

export default function RedeemDashboard(): ReactElement {
    const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const { t } = useTranslation();
    const statsApi = usePolkabtcStats();

    const [tableParams, setTableParams] = useState(defaultTableDisplayParams());
    const [totalSuccessfulRedeems, setTotalSuccessfulRedeems] = useState("-");
    const [totalRedeems, setTotalRedeems] = useState("-");
    const [totalRedeemedAmount, setTotalRedeemedAmount] = useState("-");
    const [redeemRequests, setRedeemRequests] = useState(new Array<DashboardRequestInfo>());
    const [cumulativeRedeemsPerDay, setCumulativeRedeemsPerDay] = useState(new Array<{ date: number; sat: number }>());
    const pointRedeemsPerDay = useMemo(
        () =>
            cumulativeRedeemsPerDay.map((dataPoint, i) => {
                if (i === 0) return 0;
                return dataPoint.sat - cumulativeRedeemsPerDay[i - 1].sat;
            }),
        [cumulativeRedeemsPerDay]
    );
    const redeemSuccessRate = useMemo(() => Number(totalSuccessfulRedeems) / Number(totalRedeems) || 0, [
        totalSuccessfulRedeems,
        totalRedeems,
    ]);

    const tableHeadings = [
        t("id"),
        t("redeem_page.amount"),
        t("parachainblock"),
        t("issue_page.vault_dot_address"),
        t("redeem_page.output_BTC_address"),
        t("status"),
    ];

    const tableRedeemRequestRow = useMemo(
        () => (rreq: DashboardRequestInfo): string[] => [
            rreq.id,
            satToBTC(rreq.amountPolkaBTC),
            rreq.creation,
            rreq.vaultDotAddress || "",
            rreq.btcAddress,
            rreq.completed
                ? t("completed")
                : rreq.cancelled
                ? t("cancelled")
                : rreq.isExpired
                ? t("expired")
                : rreq.reimbursed
                ? t("reimbursed")
                : t("pending"),
        ],
        [t]
    );

    const fetchRedeemRequests = useMemo(
        () => async () => {
            const res = await statsApi.getRedeems(
                tableParams.page,
                tableParams.perPage,
                tableParams.sortBy,
                tableParams.sortAsc
            );
            setRedeemRequests(res.data);
        },
        [tableParams, statsApi]
    );

    useEffect(() => {
        try {
            fetchRedeemRequests();
        } catch (e) {
            console.error(e);
        }
    }, [fetchRedeemRequests, tableParams]);

    useEffect(() => {
        const fetchTotalSuccessfulRedeems = async () => {
            const res = await statsApi.getTotalSuccessfulRedeems();
            setTotalSuccessfulRedeems(res.data);
        };

        const fetchTotalFailedRedeems = async () => {
            const res = await statsApi.getTotalRedeems();
            setTotalRedeems(res.data);
        };

        const fetchTotalRedeemedAmount = async () => {
            const res = await statsApi.getTotalRedeemedAmount();
            setTotalRedeemedAmount(res.data);
        };

        const fetchRedeemsLastDays = async () => {
            const res = await statsApi.getRecentDailyRedeems(6);
            setCumulativeRedeemsPerDay(res.data);
        };

        (async () => {
            if (!polkaBtcLoaded) return;
            try {
                await Promise.all([
                    fetchTotalSuccessfulRedeems(),
                    fetchTotalFailedRedeems(),
                    fetchTotalRedeemedAmount(),
                    fetchRedeemsLastDays(),
                ]);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [polkaBtcLoaded, statsApi]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("redeem_requests")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <div className="col-md-3">
                                    <p>
                                        {totalRedeemedAmount === "-"
                                            ? t("no_data")
                                            : t("dashboard.redeem.total_redeemed", {
                                                  amount: satToBTC(totalRedeemedAmount),
                                              })}
                                    </p>
                                </div>
                                <div className="col-md-3">
                                    <p>
                                        {totalSuccessfulRedeems === "-"
                                            ? t("no_data")
                                            : t("dashboard.redeem.total_redeems", { amount: totalSuccessfulRedeems })}
                                    </p>
                                </div>
                                <div className="col-md-2">
                                    <p>
                                        {totalRedeems === "-"
                                            ? t("no_data")
                                            : t("dashboard.redeem.success_rate", {
                                                  rate: (redeemSuccessRate * 100).toFixed(2),
                                              })}
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <LineChartComponent
                                        colour={["d_pink", "d_grey"]}
                                        label={[
                                            t("dashboard.redeem.total_redeemed_chart"),
                                            t("dashboard.redeem.perday_redeemed_chart"),
                                        ]}
                                        yLabels={cumulativeRedeemsPerDay.map((dataPoint) =>
                                            new Date(dataPoint.date).toLocaleDateString()
                                        )}
                                        yAxisProps={[{ beginAtZero: true, position: "left" }, { position: "right" }]}
                                        data={[
                                            cumulativeRedeemsPerDay.map((dataPoint) =>
                                                Number(satToBTC(dataPoint.sat.toString()))
                                            ),
                                            pointRedeemsPerDay.map((amount) => Number(satToBTC(amount.toString()))),
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DashboardTable
                        pageData={redeemRequests}
                        totalPages={Math.ceil(Number(totalRedeems) / tableParams.perPage)}
                        tableParams={tableParams}
                        setTableParams={setTableParams}
                        headings={tableHeadings}
                        dataPointDisplayer={tableRedeemRequestRow}
                    />
                </div>
            </div>
        </div>
    );
}
