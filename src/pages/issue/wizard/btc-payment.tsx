import React from "react";
import { FormGroup, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueStepAction } from "../../../common/actions/issue.actions";
import { remove0x } from "../../../common/utils/utils";

export default function BTCPayment() {
    const issueId = useSelector((state: StoreType) => state.issue.id);
    const amountBTC = useSelector((state: StoreType) => state.issue.amountBTC);
    const feeBTC = useSelector((state: StoreType) => state.issue.feeBTC);
    const isEditMode = useSelector((state: StoreType) => state.issue.wizardInEditMode);

    // FIXME: add once fee model is there
    const amountBTCwithFee = amountBTC;
    const vaultBTCAddress = useSelector((state: StoreType) => state.issue.vaultBtcAddress);
    const dispatch = useDispatch();

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
    }

    const goToNextStep = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT_CONFIRMATION"));
    }

    return <React.Fragment>
        <Modal.Body>
            <FormGroup>
                <h5>Confirmation and Payment</h5>
                <p>You have requested to mint {amountBTC} PolkaBTC, incurring a fee of {feeBTC} BTC.</p>
                <p>Please make the following Bitcoin payment.</p>
                <h5>Bitcoin Payment Details</h5>
                <p>Create a Bitcoin transaction with two outputs.</p>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>Output 1</ListGroupItem>
                        <ListGroupItem>Recipient: <strong>{remove0x(vaultBTCAddress)}</strong></ListGroupItem>
                        <ListGroupItem>Amount: <strong>{amountBTCwithFee} BTC</strong></ListGroupItem>
                    </ListGroup>
                    <ListGroup>
                        <ListGroupItem>Output 2</ListGroupItem>
                        <ListGroupItem>OP_RETURN: <strong> {remove0x(issueId)} </strong></ListGroupItem>
                        <ListGroupItem>Amount: <strong>0 BTC</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            {!isEditMode && 
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    Previous
                </button>
            }
            <button className="btn btn-primary float-right" onClick={goToNextStep}>
                Next
            </button>
        </Modal.Footer>
    </React.Fragment>
}