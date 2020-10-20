import React, { useState, useEffect } from "react";
import StatusUpdateTable from "../../common/components/status-update-table/status-update-table";
import VaultTable from "../../common/components/vault-table/vault-table";
import OracleTable from "../../common/components/oracle-table/oracle-table";
import BitcoinTable from "../../common/components/bitcoin-table/bitcoin-table";
import { useSelector } from "react-redux";

import "./dashboard.page.scss";
import { StoreType } from "../../common/types/util.types";
import { planckToDOT } from "@interlay/polkabtc";
import StakedRelayerTable from "./staked-relayer-table/staked-relayer-table";

export default function DashboardPage() {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);

    const [collateralizationRate, setCollateralizationRate] = useState("0");
    const [totalDotLocked, setDotLocked] = useState("0");
    const [planckLocked, setPlanckLocked] = useState("0");
    const [totalIssued,setTotalIssued] = useState("0");
    const [stakedRelayerAddress, setStakedRelayerAddress] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || !relayerLoaded) return;

            const address = await window.relayer.getAddress();
            const activeStakedRelayerId = window.polkaBTC.api.createType("Balance", address);
            setStakedRelayerAddress(address);
            // TO DO once API call is implemented fetch collateralizationRate
            // const collateralization = await window.polkaBTC.stakedRelayer.getFeesEarned(activeStakedRelayerId);
            // setCollateralizationRate(collateralization);

            const issued = await window.polkaBTC.treasury.totalPolkaBTC();
            setTotalIssued(issued.toString());

            const lockedDot = await window.polkaBTC.collateral.totalLockedDOT();
            setDotLocked(lockedDot.toString());
        };
        fetchData();
    },[polkaBtcLoaded, relayerLoaded]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">PolkaBTC Dashboard</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total locked: {totalDotLocked} DOT</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total issued: {totalIssued} PolkaBTC</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Collateralization rate: {collateralizationRate}</div>
                        </div>
                    </div>
                    <BitcoinTable></BitcoinTable>
                    <StatusUpdateTable
                        dotLocked={totalDotLocked}
                        planckLocked={planckLocked}
                        stakedRelayerAddress={stakedRelayerAddress}
                        readOnly={true}
                    ></StatusUpdateTable>
                    <VaultTable></VaultTable>
                    <OracleTable planckLocked={planckLocked}></OracleTable>
                    <StakedRelayerTable></StakedRelayerTable>
                </div>
            </div>
        </div>
    );
}
