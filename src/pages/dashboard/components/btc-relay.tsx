import React, { useState, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

const BtcRelay = () => {
    // TODO: Compute status using blockstream data
    const [latestRelayBlock, setLatestRelayBlock] = useState("0");
    const [latestBitcoinBlock, setLatestBitcoinBlock] = useState("0");
    const [textColour, setTextColour] = useState("d_grey");
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
        const relayTextElement = document.getElementById("relay-text") as HTMLElement;
        const relayCircleTextElement = document.getElementById("relay-circle-text") as HTMLElement;

        const btcRelayOffset = Number(latestBitcoinBlock) - Number(latestBitcoinBlock);

        if (btcRelayOffset <= outdatedRelayThreshold) {
            relayTextElement.innerHTML = " synchronized";
            relayCircleTextElement.innerHTML = "Synced";
            setTextColour("d_green");
        } else {
            // TODO: add how many blocks behind
            relayTextElement.innerHTML = " not synchronized";
            relayCircleTextElement.innerHTML = "Out of Sync";
            setTextColour("d_red");
        }
    }, [latestBitcoinBlock, polkaBtcLoaded]);
    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ fontFamily: "airbnb-cereal-bold" }}>
                        BTC Relay is
                        <span
                            style={{ color: `${getAccents(`${textColour}`).colour}`, fontFamily: "airbnb-cereal-bold" }}
                            id="relay-text"
                        >
                            Loading
                        </span>
                    </h1>
                </div>
                <div className="button-container">
                    <ButtonComponent buttonName="view BTC Relay" propsButtonColor="d_green" />
                </div>
            </div>
            <div className="circle-container">
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents(`${textColour}`).colour}` }}
                    id="relay-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: `${getAccents(`${textColour}`).colour}` }}
                        id="relay-circle-text"
                    >
                        Loading
                    </h1>
                    <p className="latest-block-text">Block {latestRelayBlock}</p>
                </div>
            </div>
        </div>
    );
};

export default BtcRelay;
