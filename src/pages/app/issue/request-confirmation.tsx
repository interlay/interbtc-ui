import { btcToSat, stripHexPrefix } from "@interlay/polkabtc";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import React, { useState } from "react";
import { shortAddress } from "../../../common/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    changeIssueIdAction,
    changeIssueStepAction,
    changeVaultBtcAddressOnIssueAction,
} from "../../../common/actions/issue.actions";
import ButtonMaybePending from "../../../common/components/pending-button";
import { StoreType } from "../../../common/types/util.types";
import Big from "big.js";
import { useTranslation } from "react-i18next";
import BitcoinLogo from "../../../assets/img/Bitcoin-Logo.png";

export default function RequestConfirmation() {
    const [isRequestPending, setRequestPending] = useState(false);
    const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const { amountBTC, vaultDotAddress, fee } = useSelector((state: StoreType) => state.issue);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onConfirm = async () => {
        if (!polkaBtcLoaded) return;
        setRequestPending(true);
        // send the issue request
        try {
            const amountSAT = btcToSat(amountBTC);
            if (amountSAT === undefined) {
                throw new Error("Invalid BTC amount input.");
            }
            const amount = window.polkaBTC.api.createType("Balance", amountSAT) as PolkaBTC;
            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultDotAddress);
            const requestResult = await window.polkaBTC.issue.request(amount, vaultAccountId);

            const vaultBTCAddress = requestResult.vault.wallet.btcAddress;
            if (vaultBTCAddress === undefined) {
                throw new Error("Could not generate unique vault address.");
            }
            dispatch(changeVaultBtcAddressOnIssueAction(stripHexPrefix(vaultBTCAddress)));
            // get the issue id from the request issue event
            const id = stripHexPrefix(requestResult.id.toString());

            // update the issue status
            dispatch(changeIssueIdAction(id));
            dispatch(changeIssueStepAction("BTC_PAYMENT"));
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setRequestPending(false);
        }
    };

    return (
        <React.Fragment>
            <div className="request-confirmation">
                <div className="issue-amount">
                    <span className="wizzard-number">{amountBTC}</span>&nbsp;PolkaBTC
                </div>
                <div className="step-item row">
                    <div className="col-6">{t("destination")}</div>
                    <div className="col-6">{shortAddress(address)}</div>
                </div>
                <div className="step-item row">
                    <div className="col-6">{t("bridge_fee")}</div>
                    <div className="col-6">
                        <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                        {fee} BTC
                    </div>
                </div>
                <hr className="total-divider"></hr>
                <div className="step-item row">
                    <div className="col-6 total-amount">{t("total_deposit")}</div>
                    <div className="col-6 total-amount">
                        <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                        {new Big(fee).add(new Big(amountBTC)).toString()} BTC
                    </div>
                </div>
            </div>
            <ButtonMaybePending className="btn btn-primary app-btn" isPending={isRequestPending} onClick={onConfirm}>
                {t("confirm")}
            </ButtonMaybePending>
        </React.Fragment>
    );
}
