import React, { useState, useEffect, ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

const BtcRelay = (): ReactElement => {
    // TODO: Compute status using blockstream data
    const [latestRelayBlock, setLatestRelayBlock] = useState("0");
    const [latestBitcoinBlock, setLatestBitcoinBlock] = useState("0");
    const [relayStatus, setRelayStatus] = useState("Loading");
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const outdatedRelayThreshold = 12;

    useEffect(() => {
        const fetchOracleData = async () => {
            if (!polkaBtcLoaded) return;
            const latestRelayBlock = await window.polkaBTC.btcRelay.getLatestBlockHeight();
            const latestBitcoinBlock = await window.polkaBTC.btcCore.getLatestBlockHeight();
            setLatestRelayBlock(latestRelayBlock.toString());
            setLatestBitcoinBlock(latestBitcoinBlock.toString());
        };
        fetchOracleData();

        const btcRelayOffset = Number(latestBitcoinBlock) - Number(latestBitcoinBlock);

        if (btcRelayOffset <= outdatedRelayThreshold) {
            setRelayStatus("synchronized");
        } else {
            // TODO: add how many blocks behind
            setRelayStatus("not synchronized");
        }
    }, [latestBitcoinBlock, polkaBtcLoaded]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 className="bold-font">
                        BTC Relay is &nbsp;
                        {relayStatus === "synchronized" ? (
                            <span style={{ color: getAccents("d_green").color }} id="relay-text" className="bold-font">
                                {relayStatus}
                            </span>
                        ) : relayStatus === "not synchronized" ? (
                            <span style={{ color: getAccents("d_red").color }} id="relay-text" className="bold-font">
                                {relayStatus}
                            </span>
                        ) : (
                            <span style={{ color: getAccents("d_grey").color }} id="relay-text" className="bold-font">
                                Loading
                            </span>
                        )}
                    </h1>
                </div>
                <div className="button-container">
                    <ButtonComponent
                        buttonName="view BTC Relay"
                        propsButtonColor="d_green"
                        buttonId="btc-relay"
                        buttonLink="/dashboard/relay"
                    />
                </div>
            </div>
            <div className="circle-container">
                {relayStatus === "synchronized" ? (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_green").color }}
                        id="relay-circle"
                    >
                        <h1
                            className="h1-xl-text"
                            style={{ color: getAccents("d_green").color }}
                            id="relay-circle-text"
                        >
                            Synced
                        </h1>
                        <p className="latest-block-text">Block {latestRelayBlock}</p>
                    </div>
                ) : relayStatus === "not synchronized" ? (
                    <div className="status-circle" style={{ borderColor: getAccents("d_red").color }} id="relay-circle">
                        <h1 className="h1-xl-text" style={{ color: getAccents("d_red").color }} id="relay-circle-text">
                            Not synced
                        </h1>
                        <p className="latest-block-text">Block {latestRelayBlock}</p>
                    </div>
                ) : (
                    <div
                        className="status-circle"
                        style={{ borderColor: getAccents("d_grey").color }}
                        id="relay-circle"
                    >
                        <h1 className="h1-xl-text" style={{ color: getAccents("d_grey").color }} id="relay-circle-text">
                            Loading
                        </h1>
                        <p className="latest-block-text">Block {latestRelayBlock}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BtcRelay;
