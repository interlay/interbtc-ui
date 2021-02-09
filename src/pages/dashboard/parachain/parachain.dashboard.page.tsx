import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import ParachainSecurity from "../components/parachain-security";
import ActiveStakedRelayers from "../components/active-staked-relayers";

import StakedRelayerTable from "../staked-relayer-table/staked-relayer-table";
import StatusUpdateTable from "../../../common/components/status-update-table/status-update-table";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { getAccents } from "../dashboard-colors";

export default function ParachainDashboard(): ReactElement {
    const { t } = useTranslation();
    const { totalLockedDOT } = useSelector((state: StoreType) => state.general);

    return (
        <div className="dashboard-page container-fluid white-background">
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
                        <StatusUpdateTable dotLocked={totalLockedDOT} readOnly={true} />
                        <StakedRelayerTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
