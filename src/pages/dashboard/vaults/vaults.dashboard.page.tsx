import React, { ReactElement } from "react";
import VaultTable from "../../../common/components/vault-table/vault-table";
import { useTranslation } from "react-i18next";
import { getAccents } from "../../../pages/dashboard/dashboard-colors";

import ActiveVaults from "../components/active-vaults";
import CollateralLocked from "../components/collateral-locked";
import Collateralization from "../components/collateralization";

export default function VaultsDashboard(): ReactElement {
    const { t } = useTranslation();

    return (
        <div className="dashboard-page">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div>
                        <div className="title-container">
                            <div
                                style={{ backgroundColor: getAccents("d_blue").color }}
                                className="issue-page-text-container"
                            >
                                <h1>{t("dashboard.vaults.vaults")}</h1>
                            </div>
                            <div style={{ backgroundColor: getAccents("d_blue").color }} className="title-line"></div>
                        </div>

                        <div className="vaults-graphs-container">
                            <ActiveVaults />
                            <CollateralLocked />
                            <Collateralization />
                        </div>
                        <div className="dashboard-table-container">
                            <VaultTable></VaultTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
