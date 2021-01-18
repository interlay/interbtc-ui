import React, { useState, useEffect, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import "./issues.dashboard.page.scss";
import IssueTable from "../../../common/components/issue-table/issue-table";
import { StoreType } from "../../../common/types/util.types";
import { IssueRequest } from "../../../common/types/issue.types";

export default function IssuesDashboard(): ReactElement {
    const { polkaBtcLoaded, totalPolkaBTC } = useSelector((state: StoreType) => state.general);
    const { t } = useTranslation();

    const [totalSuccessfulIssues, setTotalSuccessfulIssues] = useState("0");
    const [issueRequests, setIssueRequests] = useState(new Array<IssueRequest>());
    const [issuesLastDays, setIssuesLastDays] = useState(new Array<{ date: Date; amount: number }>());
    const issuesPerDay = useMemo(
        () =>
            issuesLastDays.map((dataPoint, i) => {
                if (i === 0) return 0;
                return dataPoint.amount - issuesLastDays[i - 1].amount;
            }),
        [issuesLastDays]
    );

    const fetchTotalSuccessfulIssues = async () => {
        setTotalSuccessfulIssues("443");
    };

    const fetchIssueRequests = async () => {
        setIssueRequests([
            {
                id: "0xtestmock",
                amountBTC: "1.5",
                creation: "",
                vaultBTCAddress: "tb1qhz...dknu33d",
                vaultDOTAddress: "5DAAnr...m3PTXFy",
                transactionBlockHeight: 18674,
                btcTxId: "d218f5...3f29af",
                confirmations: 0,
                completed: false,
                cancelled: false,
                fee: "15",
                griefingCollateral: "0.5",
            },
        ]);
    };

    const fetchIssuesLastDays = async () => {
        setIssuesLastDays(
            [0, 1, 2, 3, 4, 5, 6].map((d) => ({ date: new Date(Date.now() - d * 86400000), amount: 50 - d }))
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;
            await Promise.all([fetchTotalSuccessfulIssues(), fetchIssueRequests(), fetchIssuesLastDays()]);
        };
        fetchData();
    }, [polkaBtcLoaded, issueRequests, t]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("dashboard.issues")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <div className="col-md-4">
                                    <p>Placeholder - total issued (currently {totalPolkaBTC})</p>
                                </div>
                                <div className="col-md-4">
                                    <p>
                                        Placeholder - total successful Issue requests (currently {totalSuccessfulIssues}
                                        )
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <p>Placeholder: double line chart, total and per day issue requests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <IssueTable issueRequests={issueRequests} />
                </div>
            </div>
        </div>
    );
}
