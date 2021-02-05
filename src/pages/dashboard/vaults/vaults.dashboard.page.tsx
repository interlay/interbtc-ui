import React, { ReactElement } from "react";
import VaultTable from "../../../common/components/vault-table/vault-table";
import { useTranslation } from "react-i18next";

import ActiveVaults from "../components/active-vaults";
import CollateralLocked from "../components/collateral-locked";
import Collateralization from "../components/collateralization";

export default function VaultsDashboard(): ReactElement {
    const { t } = useTranslation();

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container dashboard-fade-in-animation">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">{t("dashboard.vaults.vaults")}</div>
                    </div>
                    <div className="row mt-5 mb-3">
                        <div className="col-lg-8 offset-2">
                            <div className="row">
                                <div className="col-md-4">
                                    <ActiveVaults />
                                </div>
                                <div className="col-md-4">
                                    <CollateralLocked />
                                </div>
                                <div className="col-md-4">
                                    <Collateralization />
                                </div>
                            </div>
                        </div>
                    </div>
                    <VaultTable></VaultTable>
                </div>
            </div>
        </div>
    );
}
