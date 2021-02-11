import React, { ReactElement, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ParachainSecurity from "../components/parachain-security";
import ActiveStakedRelayers from "../components/active-staked-relayers";

import StakedRelayerTable from "../staked-relayer-table/staked-relayer-table";
import { DashboardStatusUpdateInfo } from "../../../common/types/util.types";
import { getAccents } from "../dashboard-colors";
import usePolkabtcStats from "../../../common/hooks/use-polkabtc-stats";
import { defaultTableDisplayParams, formatDateTimePrecise } from "../../../common/utils/utils";
import DashboardTable, {
    StatusComponent,
    StatusCategories,
} from "../../../common/components/dashboard-table/dashboard-table";

export default function ParachainDashboard(): ReactElement {
    const { t } = useTranslation();
    const statsApi = usePolkabtcStats();
    const [statusUpdates, setStatusUpdates] = useState(new Array<DashboardStatusUpdateInfo>());
    const [tableParams, setTableParams] = useState({ ...defaultTableDisplayParams(), perPage: 10 });
    const [totalStatusUpdates, setTotalStatusUpdates] = useState("-");

    const fetchStatusUpdates = useMemo(
        () => async () => {
            const res = await statsApi.getParachainStatusUpdates(
                tableParams.page,
                tableParams.perPage,
                tableParams.sortBy,
                tableParams.sortAsc
            );
            setStatusUpdates(res.data);
        },
        [tableParams, statsApi]
    );

    const fetchTotalStatusUpdates = useMemo(
        () => async () => {
            const res = await statsApi.getTotalParachainStatusUpdates();
            setTotalStatusUpdates(res.data);
        },
        [statsApi] // to silence the compiler
    );

    useEffect(() => {
        try {
            fetchStatusUpdates();
        } catch (e) {
            console.error(e);
        }
    }, [fetchStatusUpdates, tableParams]);

    useEffect(() => {
        try {
            fetchTotalStatusUpdates();
        } catch (e) {
            console.error(e);
        }
    }, [fetchTotalStatusUpdates]);

    const tableHeadings = [
        <h1>{t("id")}</h1>,
        <h1>{t("timestamp")}</h1>,
        <h1>{t("proposed_status")}</h1>,
        <h1>{t("proposed_changes")}</h1>,
        <h1>{t("btc_block_hash")}</h1>,
        <h1>{t("votes_yes_no")}</h1>,
        <h1>{t("result")}</h1>,
    ];

    const tableStatusUpdateRow = useMemo(
        () => (updt: DashboardStatusUpdateInfo): ReactElement[] => [
            <p>{updt.id}</p>,
            <p>{formatDateTimePrecise(new Date(updt.timestamp))}</p>,
            <p>
                {updt.addError
                    ? [t("dashboard.parachain.add_error", { error: updt.addError }), updt.removeError ? <br /> : ""]
                    : updt.removeError
                    ? t("dashboard.parachain.remove_error", { error: updt.removeError })
                    : t("dashboard.parachain.no_change")}
            </p>,
            <p>{updt.btc_block_hash}</p>,
            <p>{t("dashboard.parachain.votes", { yeas: updt.yeas, nays: updt.nays })}</p>,
            <StatusComponent
                {...(updt.executed
                    ? { text: t("dashboard.parachain.executed"), category: StatusCategories.Ok }
                    : updt.forced
                    ? { text: t("dashboard.parachain.forced"), category: StatusCategories.Ok }
                    : updt.rejected
                    ? { text: t("dashboard.parachain.rejected"), category: StatusCategories.Bad }
                    : { text: t("pending"), category: StatusCategories.Neutral })}
            />,
        ],
        [t]
    );

    return (
        <div className="main-container dashboard-page">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div>
                        <div className="title-container">
                            <div
                                style={{ backgroundColor: getAccents("d_blue").color }}
                                className="issue-page-text-container"
                            >
                                <h1>{t("dashboard.parachain.parachain")}</h1>
                            </div>
                            <div style={{ backgroundColor: getAccents("d_blue").color }} className="title-line"></div>
                        </div>

                        <div className="parachain-graphs-container dashboard-graphs-container">
                            <ParachainSecurity />
                            <ActiveStakedRelayers />
                        </div>
                        <div className="dashboard-table-container">
                            <div>
                                <p className="table-heading">{t("dashboard.parachain.status_updates")}</p>
                            </div>
                            <DashboardTable
                                richTable={true}
                                pageData={statusUpdates}
                                totalPages={Math.ceil(Number(totalStatusUpdates) / tableParams.perPage)}
                                tableParams={tableParams}
                                setTableParams={setTableParams}
                                headings={tableHeadings}
                                dataPointDisplayer={tableStatusUpdateRow}
                            />
                        </div>
                        <StakedRelayerTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
