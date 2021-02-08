import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAccents } from "../../../pages/dashboard/dashboard-colors";
import { StoreType } from "../../../common/types/util.types";
import { DashboardRequestInfo } from "../../../common/types/redeem.types";
import DashboardTable, {
    StyledLinkData,
    StatusComponent,
} from "../../../common/components/dashboard-table/dashboard-table";
import { defaultTableDisplayParams, shortAddress, formatDateTimePrecise } from "../../../common/utils/utils";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { satToBTC } from "@interlay/polkabtc";
import LineChartComponent from "../components/line-chart-component";

export default function RedeemDashboard(): ReactElement {
    const { polkaBtcLoaded, prices } = useSelector((state: StoreType) => state.general);
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
        // t("id"),
        t("date"),
        t("redeem_page.amount"),
        t("parachainblock"),
        t("issue_page.vault_dot_address"),
        t("redeem_page.output_BTC_address"),
        // "BTC Transaction",
        // "BTC Confirmations",
        t("status"),
    ];

    const tableRedeemRequestRow = useMemo(
        () => (rreq: DashboardRequestInfo): ReactElement[] => [
            // <p>{shortAddress(ireq.id)}</p>,
            <p>{formatDateTimePrecise(new Date(rreq.timestamp))}</p>,
            <p>{satToBTC(rreq.amountPolkaBTC)}</p>,
            <p>{rreq.creation}</p>,
            <StyledLinkData data={shortAddress(rreq.vaultDotAddress)} />,
            <StyledLinkData data={shortAddress(rreq.btcAddress)} />,
            <StatusComponent
                status={
                    rreq.completed
                        ? "completed"
                        : rreq.cancelled
                        ? "cancelled"
                        : rreq.isExpired
                        ? "expired"
                        : rreq.reimbursed
                        ? "reimbursed"
                        : "pending"
                }
            />,
        ],
        []
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
        <div className="dashboard-page ">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div>
                        <div className="title-container">
                            <div
                                style={{ backgroundColor: getAccents("d_pink").color }}
                                className="issue-page-text-container"
                            >
                                <h1>{t("dashboard.redeem.redeem")}</h1>
                            </div>
                            <div style={{ backgroundColor: getAccents("d_pink").color }} className="title-line"></div>
                        </div>
                        <div className="table-top-data-container">
                            <div className="values-container redeem-page">
                                <div>
                                    <h2 style={{ color: `${getAccents("d_pink").color}` }}>
                                        {t("dashboard.redeem.total_redeemed")}
                                    </h2>
                                    <h1>
                                        {totalRedeemedAmount === "-"
                                            ? t("no_data")
                                            : satToBTC(totalRedeemedAmount) + "BTC"}
                                    </h1>
                                    {totalRedeemedAmount === "-" ? (
                                        ""
                                    ) : (
                                        <h1 className="h1-price-opacity">
                                            $
                                            {(
                                                prices.bitcoin.usd * parseFloat(satToBTC(totalRedeemedAmount))
                                            ).toLocaleString()}
                                        </h1>
                                    )}
                                </div>
                                <div>
                                    <h2 style={{ color: `${getAccents("d_green").color}` }}>
                                        {t("dashboard.redeem.total_redeems")}
                                    </h2>
                                    <h1>{totalSuccessfulRedeems === "-" ? t("no_data") : totalSuccessfulRedeems}</h1>
                                </div>
                                <div>
                                    <h2 style={{ color: `${getAccents("d_green").color}` }}>
                                        {t("dashboard.redeem.success_rate")}
                                    </h2>
                                    <h1>
                                        {totalRedeems === "-"
                                            ? t("no_data")
                                            : (redeemSuccessRate * 100).toFixed(2) + "%"}
                                    </h1>
                                </div>
                            </div>
                            <div>
                                <LineChartComponent
                                    color={["d_pink", "d_grey"]}
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
                        <div className="dashboard-table-container">
                            <div>
                                <p className="table-heading">{t("issue_page.recent_requests")}</p>
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
            </div>
        </div>
    );
}
