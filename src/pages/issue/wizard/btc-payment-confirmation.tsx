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
            let request = issueRequests.find((r) => r.id === issueId);
            if (request) {
                request.btcTxId = txId;
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
                                We will monitor your Bitcoin transaction and notify you when it has been confirmed. <br/>
                                You will see a "Confirm" button next to your issue request on the issue page.
                            </p>
                            <p>
                                <b>Note: Your Bitcoin payment can take up to an hour to confirm.</b>
                            </p>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col className="text-center">
                            <p className="text-left">
                                <b>Optional: if you want, you can tell us your Bitcoin txid to speed things up</b>
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
