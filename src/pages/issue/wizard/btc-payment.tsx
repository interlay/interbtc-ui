import React from "react";
import { FormGroup, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueStepAction } from "../../../common/actions/issue.actions";
import { btcToSat, satToMBTC } from "@interlay/polkabtc";

export default function BTCPayment() {
    const { id, amountBTC, fee, wizardInEditMode } = useSelector((state: StoreType) => state.issue);

    // FIXME: add once fee model is there
    const amountBTCwithFee = Number(amountBTC) + Number(amountBTC)/100*fee;
    let amountMBTCwithFee = "";
    try {
        const amountSATwithFee = btcToSat(amountBTCwithFee.toString());
        amountMBTCwithFee = satToMBTC(amountSATwithFee ? amountSATwithFee : "");
    } catch (err) {
        console.log(err);
    }
    // FIXME: returns an empty string when loaded again
    const vaultBTCAddress = useSelector((state: StoreType) => state.issue.vaultBtcAddress);
    const dispatch = useDispatch();

    const electrumPaytoField = vaultBTCAddress + ", " + amountMBTCwithFee + "\nOP_RETURN " + id + ", 0";

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
    };

    const goToNextStep = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT_CONFIRMATION"));
    };

    return (
        <React.Fragment>
            <Modal.Body>
                <FormGroup>
                    <h5>Confirmation and Payment</h5>
                    <p>
                        You have requested to mint {amountBTC} PolkaBTC, incurring a fee of {Number(amountBTC)/100*fee} BTC.
                    </p>
                    <p>
                        Please make the following Bitcoin payment as shown below{" "}
                        <b className="warning-color">within 24 hours</b>.
                    </p>
                    <p className="warning-color">
                        <b>
                            Please make exactly 1 payment for the exact specified amount. Otherwise, your request will
                            not be processed and you will lose your funds.
                        </b>
                    </p>
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>Output 1</ListGroupItem>
                            <ListGroupItem>
                                Recipient: <strong>{vaultBTCAddress}</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                Amount:{" "}
                                <strong>
                                    {amountBTCwithFee} BTC ({amountMBTCwithFee} mBTC)
                                </strong>
                            </ListGroupItem>
                        </ListGroup>
                        <ListGroup>
                            <ListGroupItem>Output 2</ListGroupItem>
                            <ListGroupItem>
                                OP_RETURN: <strong> {id} </strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                Amount: <strong>{amountBTCwithFee} BTC ({amountMBTCwithFee} mBTC)</strong>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>
                    If you are using the Electrum desktop wallet, copy+paste this into the "Pay to" field.
                    <br /> Note: copied values are in <strong>mBTC</strong> (1 mBTC = 0.001 BTC).
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>
                                <strong>
                                    {electrumPaytoField.split("\n").map((str) => (
                                        <div>{str}</div>
                                    ))}
                                </strong>
                                <CopyToClipboard text={electrumPaytoField}>
                                    <button className="btn btn-outline-dark float-right">Copy</button>
                                </CopyToClipboard>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                {!wizardInEditMode && (
                    <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                        Previous
                    </button>
                )}
                <button className="btn btn-primary float-right" onClick={goToNextStep}>
                    Next
                </button>
            </Modal.Footer>
        </React.Fragment>
    );
}
