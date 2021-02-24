import React, { ReactElement, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RedeemRequest, RedeemRequestStatus } from "../../../../common/types/redeem.types";
import BitcoinTransaction from "../../../../common/components/bitcoin-links/transaction";
import { shortAddress } from "../../../../common/utils/utils";
import * as constants from "../../../../constants";

type StatusViewProps = {
    request: RedeemRequest;
};

export default function StatusView(props: StatusViewProps): ReactElement {
    const { t } = useTranslation();
    const [stableBitcoinConfirmations, setStableBitcoinConfirmations] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setStableBitcoinConfirmations(await window.polkaBTC.btcRelay.getStableBitcoinConfirmations());
        };
        fetchData();
    });

    return (
        <div className="status-view">
            {props.request.status === RedeemRequestStatus.Completed && (
                <React.Fragment>
                    <div className="completed-status-title">{t("completed")}</div>
                    <div className="row">
                        <div className="col text-center bold-text ">
                            {t("issue_page.you_received")}{" "}
                            <span className="orange-amount bold-text">{props.request.amountPolkaBTC + " BTC"}</span>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <div className="completed-confirmations-circle">
                                <div>{t("issue_page.in_parachain_block")}</div>
                                <div className="number-of-confirmations">{props.request.creation}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center mt-4">
                            <a href="https://polkadot.js.org/apps/#/explorer" target="_blank" rel="noopener noreferrer">
                                <button className="modal-btn-green">{t("issue_page.view_parachain_block")}</button>
                            </a>
                        </div>
                    </div>

                    <div className="row btc-transaction-wrapper">
                        <div className="col">
                            <div className="btc-transaction-title">{t("issue_page.btc_transaction")}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="btc-transaction-id">{shortAddress(props.request.btcTxId)}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="btc-transaction">
                                <a
                                    href={
                                        (constants.BTC_MAINNET
                                            ? constants.BTC_EXPLORER_TRANSACTION_API
                                            : constants.BTC_TEST_EXPLORER_TRANSACTION_API) + props.request.btcTxId
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button className="modal-btn-green">
                                        {t("issue_page.view_on_block_explorer")}
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
            {props.request.status === RedeemRequestStatus.PendingWithBtcTxNotFound && (
                <React.Fragment>
                    <div className="status-title">{t("pending")}</div>
                    <div className="row">
                        <div className="col">
                            <div className="pending-circle">
                                <div>{t("redeem_page.waiting_for")}</div>
                                <div>{t("nav_vault")}</div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
            {props.request.status ===
                (RedeemRequestStatus.PendingWithTooFewConfirmations ||
                    RedeemRequestStatus.PendingWithBtcTxNotIncluded) && (
                <React.Fragment>
                    <div className="status-title">{t("received")}</div>
                    <div className="row">
                        <div className="col">
                            <div className="waiting-confirmations-circle">
                                <div>{t("redeem_page.waiting_for")}</div>
                                <div>{t("confirmations")}</div>
                                <div className="number-of-confirmations">
                                    {props.request.confirmations + "/" + stableBitcoinConfirmations}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row btc-transaction-wrapper">
                        <div className="col">
                            <div className="btc-transaction-view">{t("issue_page.btc_transaction")}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="btc-transaction-view">
                                <BitcoinTransaction txId={props.request.btcTxId} shorten />
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}
