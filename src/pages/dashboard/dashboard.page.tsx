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

    const [feesEarned, setFees] = useState("0");
    // store this in both DOT and Planck
    const [dotLocked, setDotLocked] = useState("0");
    const [planckLocked, setPlanckLocked] = useState("0");
    const [stakedRelayerAddress, setStakedRelayerAddress] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || !relayerLoaded) return;

            const address = await window.relayer.getAddress();
            const activeStakedRelayerId = window.polkaBTC.api.createType("AccountId", address);

            const feesEarned = await window.polkaBTC.stakedRelayer.getFeesEarned(activeStakedRelayerId);
            setFees(feesEarned.toString());

            setStakedRelayerAddress(address);

            const lockedPlanck = (await window.polkaBTC.stakedRelayer.getStakedDOTAmount(activeStakedRelayerId)).toString();
            const lockedDOT = planckToDOT(lockedPlanck);
            setDotLocked(lockedDOT);
            setPlanckLocked(lockedPlanck);
        };
        fetchData();
    },[polkaBtcLoaded, relayerLoaded]);

    return (
        <div className="dashboard-page container-fluid white-background">
            <div className="dashboard-container">
                <div className="dashboard-wrapper">
                    <div className="row">
                        <div className="title">Staked Relayer Dashboard</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total locked: {dotLocked} DOT</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Total issued: {feesEarned} PolkaBTC</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Collateralization rate: {feesEarned}</div>
                        </div>
                    </div>
                    <BitcoinTable></BitcoinTable>
                    <StatusUpdateTable
                        dotLocked={dotLocked}
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
