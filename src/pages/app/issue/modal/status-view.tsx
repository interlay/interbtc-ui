import React, { ReactElement, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { IssueRequest } from "../../../../common/types/issue.types";
import BitcoinTransaction from "../../../../common/components/bitcoin-links/transaction";

type StatusViewProps = {
    request: IssueRequest;
}

export default function StatusView(props: StatusViewProps): ReactElement {
    const { t } = useTranslation();
    const [requiredBtcConfirmations, setRequiredBtcConfirmations] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setRequiredBtcConfirmations(await window.polkaBTC.btcRelay.getStableBitcoinConfirmations());
        }
        fetchData();
    });

    return <div className="status-view">
        <div className="status-title">
            {props.request.completed ? t("completed") : t("received")}
        </div>
        <div className="row">
            <div className="col">
                {!props.request.completed ? <div className="waiting-confirmations-circle">
                        <div>
                            {t("issue_page.waiting_for")}
                        </div>
                        <div>
                            {t("confirmations")}
                        </div>
                        <div className="number-of-confirmations">   
                            1/{props.request.confirmations}
                        </div>
                    </div>
                    :
                    <div className="completed-confirmations-circle">
                        <div>
                            {t("issue_page.in_parachain_block")}
                        </div>
                        <div className="number-of-confirmations">   
                            {props.request.confirmations}
                        </div>
                    </div>
                }
            </div>
        </div>
        <div className="row btc-transaction-wrapper">
            <div className="col">
                <div className="btc-transaction-view">
            {props.request.confirmations<requiredBtcConfirmations ? t("issue_page.btc_transaction") : t("issue_page.deposit_transaction")}
                    {}
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <div className="btc-transaction-view">
                    <BitcoinTransaction txId={props.request.btcTxId} shorten />

                </div>
            </div>
        </div>
    </div>
} 