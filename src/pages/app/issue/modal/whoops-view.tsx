import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IssueRequest } from "../../../../common/types/issue.types";
import { StoreType } from "../../../../common/types/util.types";
import BitcoinLogo from "../../../../assets/img/small-bitcoin-logo.png";
import AppTooltip from "../../../../common/components/tooltip";
import { copyToClipboard, safeRoundEightDecimals } from "../../../../common/utils/utils";

type WhoopsViewProps = {
    request: IssueRequest;
};

export default function WhoopsView(props: WhoopsViewProps): ReactElement {
    const { t } = useTranslation();
    const { prices } = useSelector((state: StoreType) => state.general);

    return (
        <div className="status-view">
            <React.Fragment>
                <div className="col mt-4 refund-title">{t("issue_page.refund_whoops")}</div>
                <div className="row">
                    <div className="col mt-2 text-center refund-subtitle">{t("issue_page.refund_sent_more_btc")} </div>
                </div>
                <div className="step-item row mt-5">
                    <div className="col-6 text-left">{t("issue_page.refund_requested")}</div>
                    <div className="col-6 right-text">
                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img> &nbsp;
                        {props.request.requestedAmountPolkaBTC} PolkaBTC
                        <div className="send-price">
                            {"~ $" +
                                parseFloat(
                                    (Number(props.request.requestedAmountPolkaBTC) * prices.bitcoin.usd).toFixed(5)
                                )}
                        </div>
                    </div>
                </div>
                <div className="step-item row">
                    <div className="col-6 text-left orange-text total-added-value">
                        {t("issue_page.refund_deposited")}
                    </div>
                    <div className="col-6 right-text">
                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img> &nbsp;
                        {safeRoundEightDecimals(Number(props.request.btcAmountSubmittedByUser))} BTC
                        <div className="send-price">
                            {"~ $" +
                                parseFloat(
                                    (Number(props.request.btcAmountSubmittedByUser) * prices.bitcoin.usd).toFixed(5)
                                )}
                        </div>
                    </div>
                </div>
                <div className="step-item row">
                    <div className="col-6 text-left green-text total-added-value">{t("issue_page.refund_issued")}</div>
                    <div className="col-6 right-text">
                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img> &nbsp;
                        {props.request.issuedAmountBtc} PolkaBTC
                        <div className="send-price">
                            {"~ $" +
                                parseFloat((Number(props.request.issuedAmountBtc) * prices.bitcoin.usd).toFixed(5))}
                        </div>
                    </div>
                </div>
                <hr className="total-divider"></hr>
                <div className="step-item row">
                    <div className="col-6 text-left total-added-value">{t("issue_page.refund_difference")}</div>
                    <div className="col-6 right-text total-amount">
                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img> &nbsp;
                        {safeRoundEightDecimals(
                            Number(props.request.btcAmountSubmittedByUser) - Number(props.request.issuedAmountBtc)
                        )}{" "}
                        BTC
                        <div className="send-price">
                            {"~ $" +
                                parseFloat(
                                    (
                                        (Number(props.request.btcAmountSubmittedByUser) -
                                            Number(props.request.issuedAmountBtc)) *
                                        prices.bitcoin.usd
                                    ).toFixed(5)
                                )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-3 text-center refund-subtitle">
                        {t("issue_page.refund_requested_vault")}{" "}
                    </div>
                </div>
                <div className="row">
                    <div className="col mt-1 text-center refund-subtitle">
                        {t("issue_page.refund_vault_to_return")}{" "}
                        <span className="refund-amount">
                            {safeRoundEightDecimals(props.request.refundAmountBtc)} &nbsp;BTC
                        </span>{" "}
                        {t("issue_page.refund_vault_to_address")}{" "}
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col payment-address">
                        <AppTooltip text={t("click_to_copy")}>
                            <span className="copy-address" onClick={() => copyToClipboard("1")}>
                                {props.request.refundBtcAddress}
                            </span>
                        </AppTooltip>
                    </div>
                </div>
            </React.Fragment>
        </div>
    );
}
