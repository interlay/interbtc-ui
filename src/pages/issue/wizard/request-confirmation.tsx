import { btcToSat, stripHexPrefix } from "@interlay/polkabtc";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import React, { useState } from "react";
import { FormGroup, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
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


export default function RequestConfirmation() {
    const [isRequestPending, setRequestPending] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const { amountBTC, fee, vaultDotAddress, vaultBtcAddress } = useSelector((state: StoreType) => state.issue);
    const dispatch = useDispatch();

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
            const id = stripHexPrefix(requestResult.hash.toString());
            const issueRequest = await window.polkaBTC.issue.getRequestById(id);

            // update the issue status
            dispatch(changeIssueIdAction(id));

            const request: IssueRequest = {
                id,
                amountBTC: amountBTC,
                creation: issueRequest.opentime.toString(),
                vaultBTCAddress: vaultBtcAddress,
                btcTxId: "",
                fee: issueRequest.fee.toString(), 
                confirmations: 0,
                completed: false,
                merkleProof: "",
                transactionBlockHeight: 0,
                rawTransaction: new Uint8Array(),
            };
            dispatch(addIssueRequestAction(request));
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

    return (
        <React.Fragment>
            <Modal.Body>
                <FormGroup>
                    <h5>Confirm Issue Request</h5>
                    <p>Please verify and confirm your issue request.</p>
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>
                                Issuing: <strong>{amountBTC} PolkaBTC</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                Vault BTC address: <strong>{vaultBtcAddress}</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                Fees: <strong>{fee} PolkaBTC</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                Total: <strong>{((new Big(fee)).add(new Big(amountBTC))).toString()} </strong><strong>BTC</strong>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    Previous
                </button>
                <ButtonMaybePending
                    className="btn btn-primary float-right"
                    isPending={isRequestPending}
                    onClick={onConfirm}
                >
                    Confirm
                </ButtonMaybePending>
            </Modal.Footer>
        </React.Fragment>
    );
}
