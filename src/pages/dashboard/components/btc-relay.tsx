import React, { ReactElement, useState, useEffect } from "react";
import ButtonComponent from "./button-component";
import { getAccents } from "../dashboardcolors";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";
import { StyledLinkData } from "../../../common/components/dashboard-table/dashboard-table";
import * as constants from "../../../constants";

enum Status {
    Loading,
    Ok,
    Failure,
}

type BtcRelayProps = {
    linkButton?: boolean;
    displayBlockstreamData?: boolean;
};

const BtcRelay = ({ linkButton, displayBlockstreamData }: BtcRelayProps): ReactElement => {
    const { t } = useTranslation();
    // TODO: Compute status using blockstream data
    const { btcRelayHeight, bitcoinHeight } = useSelector((state: StoreType) => state.general);
    const [blockstreamTip, setBlockstreamTip] = useState("-");
    const outdatedRelayThreshold = 12;
    const state =
        bitcoinHeight === 0
            ? Status.Loading
            : bitcoinHeight - btcRelayHeight >= outdatedRelayThreshold
            ? Status.Failure
            : Status.Ok;
    const statusText =
        state === Status.Loading
            ? t("loading")
            : state === Status.Ok
            ? t("dashboard.synchronized")
            : t("dashboard.not_synchronized");
    const graphText =
        state === Status.Loading
            ? t("loading")
            : state === Status.Ok
            ? t("dashboard.synced")
            : t("dashboard.out_of_sync");
    const statusColor = state === Status.Loading ? "d_grey" : state === Status.Ok ? "d_green" : "d_red";

    useEffect(() => {
        (async () => {
            const hash = await window.polkaBTC.btcCore.getLatestBlock();
            setBlockstreamTip(hash);
        })();
    });

    return (
        <>
            <div className="card">
                <div className="card-top-content">
                    <div className="values-container">
                        <h1 className="bold-font">
                            {t("dashboard.relay.relay_is")}&nbsp;
                            <span
                                style={{ color: getAccents(statusColor).color }}
                                id="relay-text"
                                className="bold-font"
                            >
                                {statusText}
                            </span>
                        </h1>
                    </div>
                    {linkButton && (
                        <div className="button-container">
                            <ButtonComponent
                                buttonName="view BTC Relay"
                                propsButtonColor="d_green"
                                buttonId="btc-relay"
                                buttonLink="/dashboard/relay"
                            />
                        </div>
                    )}
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
                        <p className="latest-block-text">
                            {t("dashboard.relay.block_number", { number: btcRelayHeight })}
                        </p>
                    </div>
                </div>
            </div>
            {displayBlockstreamData && (
                <div className="card">
                    <div className="circle-container">
                        <div
                            className="status-circle"
                            style={{ borderColor: getAccents("d_blue").color }}
                            id="relay-circle"
                        >
                            <h1
                                className="h1-xl-text"
                                style={{ color: getAccents("d_blue").color }}
                                id="relay-circle-text"
                            >
                                {t("blockstream")}
                            </h1>
                            <p className="latest-block-text">
                                {t("dashboard.relay.block_number", { number: bitcoinHeight })}
                            </p>
                            {blockstreamTip !== "-" && (
                                <StyledLinkData
                                    data={t("dashboard.relay.blockstream_verify_link")}
                                    target={
                                        (constants.BTC_MAINNET
                                            ? constants.BTC_EXPLORER_BLOCK_API
                                            : constants.BTC_TEST_EXPLORER_BLOCK_API) + blockstreamTip
                                    }
                                    newTab={true}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BtcRelay;
