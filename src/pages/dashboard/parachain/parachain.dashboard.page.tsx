import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import ParachainSecurity from "../components/parachain-security";
import ActiveStakedRelayers from "../components/active-staked-relayers";

import StakedRelayerTable from "../staked-relayer-table/staked-relayer-table";
import StatusUpdateTable from "../../../common/components/status-update-table/status-update-table";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

export default function ParachainDashboard(): ReactElement {
    const { t } = useTranslation();
    const { totalLockedDOT } = useSelector((state: StoreType) => state.general);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("dashboard.relay.btcrelay")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <div className="col-md-4">
                                    <ParachainSecurity />
                                </div>
                                <div className="col-md-4">
                                    <ActiveStakedRelayers />
                                </div>
                            </div>
                        </div>
                    </div>
                    <StatusUpdateTable dotLocked={totalLockedDOT} readOnly={true} />
                    <StakedRelayerTable />
                </div>
            </div>
        </div>
    );
}
