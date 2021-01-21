import { btcToSat, stripHexPrefix } from "@interlay/polkabtc";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import React, { useState } from "react";
import { FormGroup, ListGroup, ListGroupItem } from "react-bootstrap";
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
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const { amountBTC, vaultDotAddress, vaultBtcAddress, fee, griefingCollateral } = useSelector(
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

            // get the issue id from the request issue event
            const id = stripHexPrefix(requestResult.id.toString());
            const issueRequest = await window.polkaBTC.issue.getRequestById(id);

            // update the issue status
            dispatch(changeIssueIdAction(id));

            const request: IssueRequest = {
                id,
                amountBTC: amountBTC,
                creation: issueRequest.opentime.toString(),
                vaultBTCAddress: vaultBtcAddress,
                vaultDOTAddress: "",
                btcTxId: "",
                fee: fee,
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

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("ENTER_BTC_AMOUNT"));
    };

    return <React.Fragment>
        <FormGroup>
            <h5>{t("issue_page.confirm_issue_request")}</h5>
            <p>{t("issue_page.verify_and_confirm")}</p>
            <FormGroup>
                <ListGroup>
                    <ListGroupItem>
                        {t("issue_page.issuing")} <strong>{amountBTC} PolkaBTC</strong>
                    </ListGroupItem>
                    <ListGroupItem>
                        {t("issue_page.vault_btc_address")}: <strong>{vaultBtcAddress}</strong>
                    </ListGroupItem>
                    <ListGroupItem>
                        {t("issue_page.fees")} <strong>{fee} PolkaBTC</strong>
                    </ListGroupItem>
                    <ListGroupItem>
                        {t("griefing_collateral")}: <strong>{griefingCollateral} DOT</strong> {t("issue_page.successful_completion")}
                    </ListGroupItem>
                    <ListGroupItem>
                        {t("issue_page.total")} <strong>{new Big(fee).add(new Big(amountBTC)).toString()} </strong>
                        <strong>BTC</strong>
                    </ListGroupItem>
                </ListGroup>
            </FormGroup>
        </FormGroup>
        <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
            {t("previous")}
        </button>
        <ButtonMaybePending
            className="btn btn-primary float-right"
            isPending={isRequestPending}
            onClick={onConfirm}
        >
            {t("confirm")}
        </ButtonMaybePending>
    </React.Fragment>;
}
