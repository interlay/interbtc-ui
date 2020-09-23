import React, { ReactElement, useState } from "react";
import BitcoinTable from "./bitcoin-table/bitcoin-table";
import ReportModal from "./report-modal/report-modal";
import { Button } from "react-bootstrap";
import BtcParachainTable from "./btc-parachain-table/btc-parachain-table";
import VaultTable from "./vault-table/vault-table";
import OracleTable from "./oracle-table/oracle-table";

import "./staked-relayer.page.scss";

export default function StakedRelayerPage(): ReactElement {
    const btcParachainStatus = false;
    const vaultStatus = false;
    const oracleStatus = false;
    const [showReportModal, setShowReportModal] = useState(false);
    const handleClose = () => setShowReportModal(false);

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
        <BitcoinTable></BitcoinTable>
        <div className="row">
            <div className="col-12">
                <div className="report-button-wrapper">
                    <Button variant="primary" onClick={()=>setShowReportModal(true)}>
                        Report Invalid block
                    </Button>
                </div>
            </div>
        </div>
        <ReportModal onClose={handleClose} show={showReportModal}></ReportModal>
        <BtcParachainTable></BtcParachainTable>
        <VaultTable></VaultTable>
        <OracleTable></OracleTable>
    </div>;
}