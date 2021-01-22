import { btcToSat, stripHexPrefix } from "@interlay/polkabtc";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import React, { useState } from "react";
import { shortAddress } from "../../../common/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    changeIssueIdAction,
    changeIssueStepAction,
    addIssueRequestAction,
} from "../../../common/actions/issue.actions";
import ButtonMaybePending from "../../../common/components/pending-button";
import { IssueRequest } from "../../../common/types/issue.types";
import { StoreType } from "../../../common/types/util.types";
import Big from "big.js";
import { startTransactionWatcherIssue } from "../../../common/utils/issue-transaction.watcher";
import { useTranslation } from "react-i18next";


export default function RequestConfirmation() {
    const [isRequestPending, setRequestPending] = useState(false);
    const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const { amountBTC, vaultDotAddress, fee, griefingCollateral } = useSelector(
        (state: StoreType) => state.issue
    );
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
            // FIXME: use AccountId type from @polkadot/types/interfaces
            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultDotAddress);
            const requestResult = await window.polkaBTC.issue.request(amount, vaultAccountId);

            let vaultBTCAddress = requestResult.vault.wallet.btcAddress;
            // get the issue id from the request issue event
            const id = stripHexPrefix(requestResult.id.toString());
            const issueRequest = await window.polkaBTC.issue.getRequestById(id);

            // update the issue status
            dispatch(changeIssueIdAction(id));

            const request: IssueRequest = {
                id,
                amountBTC: amountBTC,
                creation: issueRequest.opentime.toString(),
                vaultBTCAddress: vaultBTCAddress || "",
                vaultDOTAddress: "",
                btcTxId: "",
                fee: fee,
                totalAmount: ((new Big(fee)).add(new Big(amountBTC))).toString(),
                griefingCollateral,
                confirmations: 0,
                completed: false,
                cancelled: false,
                merkleProof: "",
                transactionBlockHeight: 0,
                rawTransaction: new Uint8Array(),
            };
            dispatch(addIssueRequestAction(request));
            startTransactionWatcherIssue(request, dispatch);
            dispatch(changeIssueStepAction("BTC_PAYMENT"));
        } catch (error) {
            toast.error(error.toString());
        } finally {
            setRequestPending(false);
        }
    };

    return <React.Fragment>
       <div className="request-confirmation">
       <div className="issue-amount"><span className="wizzard-number">{amountBTC}</span>&nbsp;PolkaBTC</div>
            <div className="issue-step-item row">
                <div className="col-6">{t("destination")}</div>
                <div className="col-6">{shortAddress(address)}</div>
            </div>
            <div className="issue-step-item row">
                <div className="col-6">{t("bridge_fee")}</div>
                <div className="col-6">{fee} BTC</div>
            </div>
            <hr className="total-divider"></hr>
            <div className="issue-step-item row">
                    <div className="col-6 total-amount">{t("total_deposit")}</div>
                    <div className="col-6 total-amount">{((new Big(fee)).add(new Big(amountBTC))).toString()} BTC</div>
            </div>
       </div>
        <ButtonMaybePending
            className="btn btn-primary app-btn"
            isPending={isRequestPending}
            onClick={onConfirm}
        >
            {t("confirm")}
        </ButtonMaybePending>
    </React.Fragment>;
}
