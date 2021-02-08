import React, { ReactElement } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";

enum Status {Loading, Ok, Failure}

const BtcRelay = (): ReactElement => {
    const { t } = useTranslation();
    // TODO: Compute status using blockstream data
    const { btcRelayHeight, bitcoinHeight } = useSelector((state: StoreType) => state.general);
    const outdatedRelayThreshold = 12;
    const state = bitcoinHeight === 0 ? Status.Loading : bitcoinHeight - btcRelayHeight <= outdatedRelayThreshold ? Status.Failure: Status.Ok;
    const statusText = state === Status.Loading ? t("loading") : state === Status.Ok ? t("dashboard.synchronized") : t("dashboard.not_synchronized");
    const graphText = state === Status.Loading ? t("loading") : state === Status.Ok ? t("dashboard.synced") : t("dashboard.out_of_sync");
    const statusColor = state === Status.Loading? "d_grey": state === Status.Ok ? "d_green" : "d_red";

    return (
        <div className="card">
            <div className="card-top-content">
                <div className="values-container">
                    <h1 className="bold-font">
                        BTC Relay is &nbsp;
                        <span style={{ color: getAccents(statusColor).color }} id="relay-text" className="bold-font">
                            {statusText}
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
                    style={{ borderColor: getAccents(statusColor).color }}
                    id="relay-circle"
                >
                    <h1
                        className="h1-xl-text"
                        style={{ color: getAccents(statusColor).color }}
                        id="relay-circle-text"
                    >
                        {graphText}
                    </h1>
                    <p className="latest-block-text">Block {btcRelayHeight}</p>
                </div>
            </div>
        </div>
    );
};

export default BtcRelay;
