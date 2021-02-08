import React, { ReactElement, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IssueRequest } from "../../../../common/types/issue.types";
import BitcoinTransaction from "../../../../common/components/bitcoin-links/transaction";

type StatusViewProps = {
    request: IssueRequest;
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
            {props.request.completed && (
                <React.Fragment>
                    <div className="status-title">{t("completed")}</div>
                    <div className="row">
                        <div className="col">
                            <div className="completed-confirmations-circle">
                                <div>{t("issue_page.in_parachain_block")}</div>
                                <div className="number-of-confirmations">{props.request.creation}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row btc-transaction-wrapper">
                        <div className="col">
                            <div className="btc-transaction-view">{t("issue_page.deposit_transaction")}</div>
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
            {props.request.cancelled && (
                <React.Fragment>
                    <div className="status-title">{t("cancelled")}</div>
                    <div className="row">
                        <div className="col">
                            <div className="cancelled-confirmations-circle">
                                <div>{t("issue_page.transaction_not_set")}</div>
                                <div>{t("issue_page.time")}</div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )}
            {!props.request.completed && !props.request.cancelled && (
                <React.Fragment>
                    <div className="status-title">
                        {props.request.confirmations < stableBitcoinConfirmations ? t("received") : t("confirmed")}
                    </div>
                    <div className="row">
                        <div className="col">
                            {props.request.confirmations < stableBitcoinConfirmations ? (
                                <div className="waiting-confirmations-circle">
                                    <div>{t("issue_page.waiting_for")}</div>
                                    <div>{t("confirmations")}</div>
                                    <div className="number-of-confirmations">
                                        {props.request.confirmations + "/" + stableBitcoinConfirmations}
                                    </div>
                                </div>
                            ) : (
                                <div className="completed-confirmations-circle">
                                    <div>{t("issue_page.confirmations")}</div>
                                    <div className="number-of-confirmations">
                                        {props.request.confirmations + "/" + stableBitcoinConfirmations}
                                    </div>
                                </div>
                            )}
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
