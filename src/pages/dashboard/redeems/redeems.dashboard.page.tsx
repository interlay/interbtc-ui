import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import RedeemTable from "./redeem-table/redeem-table";
import { StoreType } from "../../../common/types/util.types";
import { RedeemRequest } from "../../../common/types/redeem.types";

export default function RedeemsDashboard(): ReactElement {
    const { polkaBtcLoaded, totalPolkaBTC } = useSelector((state: StoreType) => state.general);
    const { t } = useTranslation();

    const [totalSuccessfulRedeems, setTotalSuccessfulRedeems] = useState(0);
    const [totalFailedRedeems, setTotalFailedRedeems] = useState(0);
    const [redeemRequests, setRedeemRequests] = useState(new Array<RedeemRequest>());
    const [redeemsLastDays, setRedeemsLastDays] = useState(new Array<{ date: Date; amount: number }>());
    const redeemsPerDay = useMemo(
        () =>
            redeemsLastDays.map((dataPoint, i) => {
                if (i === 0) return 0;
                return dataPoint.amount - redeemsLastDays[i - 1].amount;
            }),
        [redeemsLastDays]
    );
    const redeemSuccessRate = useMemo(
        () => (totalSuccessfulRedeems / (totalSuccessfulRedeems + totalFailedRedeems)).toFixed(2),
        [totalSuccessfulRedeems, totalFailedRedeems]
    );

    const fetchTotalSuccessfulRedeems = async () => {
        setTotalSuccessfulRedeems(443);
    };

    const fetchTotalFailedRedeems = async () => {
        setTotalFailedRedeems(12);
    };

    const fetchRedeemRequests = async () => {
        setRedeemRequests([
            {
                id: "0xtestmock",
                amountPolkaBTC: "1.5",
                creation: "18743",
                btcAddress: "tb1qhz...dknu33d",
                vaultDotAddress: "5DAAnr...m3PTXFy",
                btcTxId: "d218f5...3f29af",
                confirmations: 0,
                completed: false,
                cancelled: false,
                isExpired: false,
                reimbursed: false,
                fee: "15",
            },
        ]);
    };

    const fetchRedeemsLastDays = async () => {
        setRedeemsLastDays(
            [0, 1, 2, 3, 4, 5, 6].map((d) => ({ date: new Date(Date.now() - d * 86400000), amount: 50 - d }))
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            await Promise.all([
                fetchTotalSuccessfulRedeems(),
                fetchTotalFailedRedeems(),
                fetchRedeemRequests(),
                fetchRedeemsLastDays(),
            ]);
        };
        fetchData();
    }, [polkaBtcLoaded, redeemRequests, t]);

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
                                    <p>Placeholder - total redeemed (currently {totalPolkaBTC})</p>
                                </div>
                                <div className="col-md-3">
                                    <p>
                                        Placeholder - total successful Redeem requests (currently{" "}
                                        {totalSuccessfulRedeems})
                                    </p>
                                </div>
                                <div className="col-md-2">
                                    <p>Placeholder - redeem success rate (currently {redeemSuccessRate}</p>
                                </div>
                                <div className="col-md-4">
                                    <p>Placeholder: double line chart, total and per day redeem requests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RedeemTable redeemRequests={redeemRequests} />
                </div>
            </div>
        </div>
    );
}
