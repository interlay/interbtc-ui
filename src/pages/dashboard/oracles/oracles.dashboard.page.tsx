import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import OracleStatus from "../components/oracle-status";
import OracleTable from "../../../common/components/oracle-table/oracle-table";

export default function OraclesDashboard(): ReactElement {
    const { t } = useTranslation();

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
                                <OracleStatus />
                            </div>
                        </div>
                    </div>
                    <OracleTable planckLocked={"1"} />
                </div>
            </div>
        </div>
    );
}
