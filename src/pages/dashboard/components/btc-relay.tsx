import React, { ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";

const BtcRelay = (): ReactElement => {
    // TODO: Compute status using blockstream data
    const { btcRelayHeight, bitcoinHeight } = useSelector((state: StoreType) => state.general);
    const outdatedRelayThreshold = 12;
    const isSynced = bitcoinHeight - btcRelayHeight <= outdatedRelayThreshold;
    const textColour = isSynced ? "d_green" : "d_red";
    const { t } = useTranslation();

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 style={{ fontFamily: "airbnb-cereal-bold" }}>
                        BTC Relay is 
                        <span
                            style={{ color: `${getAccents(`${textColour}`).colour}`, fontFamily: "airbnb-cereal-bold" }}
                            >
                            {isSynced ? t("dashboard.synchronized") : t("dashboard.not_synchronized")} 
                        </span>
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
                <div
                    className="status-circle"
                    style={{ borderColor: `${getAccents(`${textColour}`).colour}` }}
                    id="relay-circle"
                >
                    <h1 className="h1-xl-text"
                        style={{ color: `${getAccents(`${textColour}`).colour}` }}>
                        {isSynced ? t("dashboard.synced") : t("dashboard.out_of_sync")}
                    </h1>
                    <p className="latest-block-text">Block {btcRelayHeight}</p>
                </div>
            </div>
        </div>
    );
};

export default BtcRelay;
