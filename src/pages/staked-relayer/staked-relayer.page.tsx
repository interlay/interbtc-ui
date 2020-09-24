import React, { useState, useEffect } from "react";
import BitcoinTable from "./bitcoin-table/bitcoin-table";
import ReportModal from "./report-modal/report-modal";
import { Button } from "react-bootstrap";
import BtcParachainTable from "./btc-parachain-table/btc-parachain-table";
import VaultTable from "./vault-table/vault-table";
import OracleTable from "./oracle-table/oracle-table";

import { createPolkabtcAPI } from "@interlay/polkabtc";

import "./staked-relayer.page.scss";

export default function StakedRelayerPage() {
    const [showReportModal, setShowReportModal] = useState(false);
    const handleClose = () => setShowReportModal(false);

    useEffect(() => {
        const fetchparachains = async () => {
            const polkaBTC = await createPolkabtcAPI("mock");
            const activeStakedRelayerId = polkaBTC.api.createType("AccountId");
            const feesEarnedByActiveStakedRelayer = await polkaBTC.stakedRelayer.getFeesEarned(
                activeStakedRelayerId
            );
            const issues = await polkaBTC.issue.list();

            console.log("feesEarnedByActiveStakedRelayer:");
            console.log(feesEarnedByActiveStakedRelayer.words[0]);

            console.log("issue 0 requester (AccountId converted to string):");
            console.log(issues[0].requester.toHuman());

            console.log("issue 1:");
            console.log(issues[1]);
        };
        fetchparachains();
    });

    return <div className="staked-relayer-page container-fluid">
        <div className="row">
            <div className="title">
                PolkaBTC
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="stats">
                    DOT Locked:
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="stats">
                    Fees earned:
                </div>
            </div>
        </div>
        <Button variant="outline-success" className="staked-button">
            Register (Lock DOT)
        </Button>
        <BitcoinTable></BitcoinTable>
        <Button variant="outline-danger" className="staked-button" onClick={() => setShowReportModal(true)}>
            Report Invalid block
        </Button>
        <ReportModal onClose={handleClose} show={showReportModal}></ReportModal>
        <BtcParachainTable></BtcParachainTable>
        <VaultTable></VaultTable>
        <OracleTable></OracleTable>
        <Button variant="outline-danger" className="staked-button" onClick={() => setShowReportModal(true)}>
            Deregister
        </Button>
        <div className="row">
            <div className="col-12 de-note">
                Note: You can only deregister if you are not participating in a vote
            </div>
        </div>
    </div>;
}