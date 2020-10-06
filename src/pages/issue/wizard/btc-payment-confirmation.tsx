import React, { ChangeEvent } from "react";
import { FormGroup, Row, Col, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { changeBtcTxIdAction, changeIssueStepAction } from "../../../common/actions/issue.actions";
import { StoreType } from "../../../common/types/util.types";
import { remove0x } from "../../../common/utils/utils";

type BTCPaymentConfirmationProps = {
    closeModal: () => void;
}

type BTCTxIdForm = {
    btcTxId: string;
}

export default function BTCPaymentConfirmation(props: BTCPaymentConfirmationProps) {
    const issueId = useSelector((state: StoreType) => state.issue.id);
    const btcTxId = useSelector((state: StoreType) => state.issue.btcTxId);
    const { register, handleSubmit, errors } = useForm<BTCTxIdForm>({defaultValues: {btcTxId}});
    const storage = useSelector((state: StoreType) => state.storage);
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async () => {
        props.closeModal();
    })

    const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "btcTxId") {
            const txId = remove0x(value);
            dispatch(changeBtcTxIdAction(txId));
            let request = storage.getIssueRequest(issueId);
            if (request) {
                request.btcTxId = txId;
                storage.modifyIssueRequest(request);
            } else {
                toast.error("Exception: Issue request not found.");
            }
        }
    }

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT"));
    }

    return <form onSubmit={onSubmit}>
        <Modal.Body>
            <FormGroup>
                <h5>Confirm BTC Payment</h5>
                <Row className="justify-content-md-center">
                    <Col md="auto" className="text-left">
                        <p>
                            <b>Please enter the transaction id of your Bitcoin payment:</b>
                        </p>
                        <input
                            id="btcTxId"
                            name="btcTxId"
                            type="string"
                            value={btcTxId}
                            onChange={onChange}
                            className={"custom-input" + (errors.btcTxId? " error-borders" : "")}
                            ref={register({
                                // FIXME: add transaction format check that depends on global mainnet | testnet parameter
                                required: true, // pattern: {
                                    // value: BTC_ADDRESS_TESTNET_REGEX,
                                    //message: "Please enter valid BTC address"
                                // }
                            })}
                        />
                        {errors.btcTxId && (<div className="input-error">
                            {errors.btcTxId.type === "required" ? "Please enter the your btc transaction id"
                                : errors.btcTxId.message}
                        </div>
                        )}
                        <p>
                            We will monitor your Bitcoin transaction and notify you when it has been confirmed
                            You will see a "Confirm" button next to your issue request on the issue page.
                        </p>
                        <p>
                            <b>Note: Your Bitcoin payment can take up to an hour to confirm.</b>
                        </p>
                    </Col>
                    <button
                        className="btn btn-primary float-right"
                        type="submit">
                        I have made the Bitcoin payment
                </button>
                </Row>
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                Previous
            </button>
        </Modal.Footer>
    </form>
}
