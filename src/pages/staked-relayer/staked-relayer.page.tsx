import React, { ReactElement } from "react";

import "./staked-relayer.page.scss";

export default function StakedRelayerPage(): ReactElement {
    const relayStatus = false;
    const btcParachainStatus = false;
    const vaultStatus = false;
    const oracleStatus = false;

    return <div className="staked-relayer-page container">
        <div className="row">
            <div className="title">
                PolkaBTC
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="">

                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="header">
                    Bitcoin Relay Status: {relayStatus}
                </div>
            </div>
            <div className="col-12">
                <div className="header">
                    BTC Parachain Status: {btcParachainStatus}
                </div>
            </div>
            <div className="col-12">
                <div className="header">
                    Vault Status: {vaultStatus}
                </div>
            </div>
            <div className="col-12">
                <div className="header">
                    Oracle Status: {oracleStatus}
                </div>
            </div>
        </div>
        
    </div>;
}