import React, { useState, useEffect } from "react";
import StatusUpdateTable from "../../common/components/status-update-table/status-update-table";
import VaultTable from "../../common/components/vault-table/vault-table";
import OracleTable from "../../common/components/oracle-table/oracle-table";
import BitcoinTable from "../../common/components/bitcoin-table/bitcoin-table";
import { useSelector } from "react-redux";

import "./dashboard.page.scss";
import { StoreType } from "../../common/types/util.types";
import StakedRelayerTable from "./staked-relayer-table/staked-relayer-table";
import { toast } from "react-toastify";

export default function DashboardPage() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const totalPolkaBTC = useSelector((state: StoreType) => state.general.totalPolkaBTC);
    const totalLockedDOT = useSelector((state: StoreType) => state.general.totalLockedDOT);
    const [collateralizationRate, setCollateralizationRate] = useState("∞");

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const collateralization = await window.polkaBTC.vaults.getSystemCollateralization();
                if (collateralization === undefined) {
                    setCollateralizationRate("∞");
                } else {
                    setCollateralizationRate((collateralization * 100).toString());
                }
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">PolkaBTC Dashboard</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total locked: {totalLockedDOT} DOT</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total issued: {totalPolkaBTC} PolkaBTC</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Collateralization rate: {collateralizationRate}</div>
                        </div>
                    </div>
                    <BitcoinTable></BitcoinTable>
                    <StatusUpdateTable dotLocked={totalLockedDOT} readOnly={true}></StatusUpdateTable>
                    <VaultTable></VaultTable>
                    <OracleTable planckLocked={"1"}></OracleTable>
                    <StakedRelayerTable></StakedRelayerTable>
                </div>
            </div>
        </div>
    );
}
