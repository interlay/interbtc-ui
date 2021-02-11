import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import OracleStatus from "../components/oracle-status";
import OracleTable from "../../../common/components/oracle-table/oracle-table";
import { getAccents } from "../dashboard-colors";

export default function OraclesDashboard(): ReactElement {
    const { t } = useTranslation();

    return (
        <div className="dashboard-page main-container">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div>
                        <div className="title-container">
                            <div
                                style={{ backgroundColor: getAccents("d_blue").color }}
                                className="issue-page-text-container"
                            >
                                <h1>{t("dashboard.oracles.oracles")}</h1>
                            </div>
                            <div style={{ backgroundColor: getAccents("d_blue").color }} className="title-line"></div>
                        </div>

                        <div className="dashboard-graphs-container">
                            <OracleStatus />
                        </div>
                        <OracleTable planckLocked={"1"} />
                    </div>
                </div>
            </div>
        </div>
    );
}
