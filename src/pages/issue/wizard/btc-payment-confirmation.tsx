import React, { ChangeEvent } from "react";
import { FormGroup, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    changeBtcTxIdAction,
    changeIssueStepAction,
    updateIssueRequestAction,
} from "../../../common/actions/issue.actions";
import { StoreType } from "../../../common/types/util.types";
import { BTC_TRANSACTION_ID_REGEX } from "../../../constants";

type BTCPaymentConfirmationProps = {
    closeModal: () => void;
};

type BTCTxIdForm = {
    btcTxId: string;
};

export default function BTCPaymentConfirmation(props: BTCPaymentConfirmationProps) {
    const issueId = useSelector((state: StoreType) => state.issue.id);
    const btcTxId = useSelector((state: StoreType) => state.issue.btcTxId);
    const { register, handleSubmit, errors } = useForm<BTCTxIdForm>({ defaultValues: { btcTxId } });
    const address = useSelector((state: StoreType) => state.general.address);
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address);
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async () => {
        props.closeModal();
    });

    const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "btcTxId" && issueRequests) {
            const txId = value;
            dispatch(changeBtcTxIdAction(txId));
            const request = issueRequests.find((r) => r.id === issueId);
            if (request) {
                request.btcTxId = txId;

                try {
                    request.confirmations = (await window.polkaBTC.btcCore.getTransactionStatus(request.btcTxId)).confirmations;
                } catch (err) {
                    console.log("Transaction not yet included in Bitcoin.");
                }

                dispatch(updateIssueRequestAction(request));
            } else {
                toast.error("Exception: Issue request not found.");
            }
        }
    };

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT"));
    };

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <FormGroup>
                    <h5>Confirmation</h5>
                    <Row className="justify-content-md-center">
                        <Col className="text-left">
                            <p>
                                {" "}
                                <b>Your request is now being processed.</b>
                                <br />
                                <br />
                                We will monitor Bitcoin for your transaction (via the Issue ID in the OP_RETURN output).
                                <br />
                                Once it has sufficient confirmations, an "Execute" button will appear for this issue request.
                            </p>
                            <p>
                                <b>Note: Your Bitcoin payment can take up to an hour to confirm.</b>
                            </p>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col className="text-center">
                            <p className="text-left">
                                Optional: inform us of your Bitcoin txid to speed things up
                            </p>
                            <input
                                id="btcTxId"
                                name="btcTxId"
                                type="string"
                                value={btcTxId}
                                onChange={onChange}
                                className={"custom-input" + (errors.btcTxId ? " error-borders" : "")}
                                ref={register({
                                    pattern: {
                                        value: BTC_TRANSACTION_ID_REGEX,
                                        message: "Please enter valid transaction Id",
                                    },
                                })}
                            />
                            {errors.btcTxId && (
                                <div className="input-error">
                                    {errors.btcTxId.type === "required"
                                        ? "Please enter the your btc transaction id"
                                        : errors.btcTxId.message}
                                </div>
                            )}
                            <button className="btn btn-primary" type="submit">
                                I have made the Bitcoin payment
                            </button>
                        </Col>
                    </Row>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    Previous
                </button>
            </Modal.Footer>
        </form>
    );
}
