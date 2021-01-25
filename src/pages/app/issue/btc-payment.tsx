import React from "react";
import { FormGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import  QRCode from "qrcode.react";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueStepAction } from "../../../common/actions/issue.actions";
import { btcToSat, satToMBTC } from "@interlay/polkabtc";
import Big from "big.js";
import { useTranslation } from "react-i18next";

export default function BTCPayment() {
    const { amountBTC, fee, vaultBtcAddress } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();

    const amountBTCwithFee = new Big(fee).add(new Big(amountBTC));
    let amountMBTCwithFee = "";
    try {
        const amountSATwithFee = btcToSat(amountBTCwithFee.toString());
        amountMBTCwithFee = satToMBTC(amountSATwithFee ? amountSATwithFee : "");
    } catch (err) {
        console.log(err);
    }

    const dispatch = useDispatch();

    const submit = () => {
        dispatch(changeIssueStepAction("ENTER_BTC_AMOUNT"));
    };

    return <React.Fragment>
        <FormGroup>
            <div className="row payment-title">
                <div className="col">
                    {t("deposit")} &nbsp; {amountBTCwithFee.toString()} &nbsp; BTC 
                </div>
            </div>
            <div className="row payment-description">
                <div className="col">
                    {t("issue_page.single_transaction")}
                </div>
            </div>
            <div className="row ">
                <div className="col payment-address">
                    <span>{vaultBtcAddress}</span>
                </div>
            </div>
            <div className="row payment-timer-with">
                <div className="col">{t("issue_page.within")}</div>
            </div>
            <div className="row payment-timer">
                <div className="col">24h</div>
            </div>
            <div className="row justify-content-center">
                <div className="col-3">
                    <QRCode value={'bitcoin:' + vaultBtcAddress + '?amount=' + amountMBTCwithFee} />
                </div>
            </div>

            <a href={"ledgerhq:?address=" + vaultBtcAddress + "&currency=bitcoin&amount=" + btcToSat(amountBTCwithFee.toString())}>nesto da se klikne</a>

            <div className="row justify-content-center">
            <div className="col ledger-wrapper">
                <a href={"ledgerhq:?address=" + vaultBtcAddress + "&currency=bitcoin&amount=" + btcToSat(amountBTCwithFee.toString())}>
                    <div className="ledger-logo-wrapper">
                        <div className="ledger-logo">
                            <div className="col">{t("issue_page.pay_with")}</div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        </FormGroup>

        <button className="btn btn-primary app-btn" onClick={submit}>
            {t("issue_page.made_payment")}
        </button>
    </React.Fragment>;
}
