import React, { ReactElement } from "react";
import { useTranslation } from 'react-i18next';
import { IssueRequest } from "../../../../common/types/issue.types";
import  QRCode from "qrcode.react";
import Big from "big.js";

type PaymentViewProps = {
    request: IssueRequest;
}

export default function PaymentView(props: PaymentViewProps): ReactElement {
    const { t } = useTranslation();
    const amount = ((new Big(props.request.amountBTC)).add(new Big(props.request.fee))).toString();

    return <div className="payment-view">
        <div className="row payment-title">
            <div className="col">
                {t("deposit")} &nbsp; {props.request.amountBTC} &nbsp; BTC 
            </div>
        </div>
        <div className="row payment-description">
            <div className="col">
                {t("issue_page.single_transaction")}
            </div>
        </div>
        <div className="row ">
            <div className="col payment-address">
                <span>{props.request.vaultBTCAddress}</span>
            </div>
        </div>
        <div className="row payment-timer-with">
            <div className="col">{t("issue_page.within")}</div>
        </div>
        <div className="row payment-timer">
            <div className="col">{props.request.creation}</div>
        </div>
        <div className="row">
            <div className="col qr-code-item">
                <QRCode value={'bitcoin:' + props.request.vaultBTCAddress + '?amount=' + amount} />
            </div>
        </div>

        <div className="row justify-content-center">
            <div className="col ledger-wrapper">
                <div className="ledger-logo-wrapper">
                    <div className="ledger-logo">
                        <div className="col">{t("issue_page.pay_with")}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
} 