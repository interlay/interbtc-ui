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
import { useTranslation } from 'react-i18next';


type BTCPaymentConfirmationProps = {
    closeModal: () => void;
};

type BTCTxIdForm = {
    btcTxId: string;
};

export default function BTCPaymentConfirmation(props: BTCPaymentConfirmationProps) {
    const { id, btcTxId } = useSelector((state: StoreType) => state.issue);
    const address = useSelector((state: StoreType) => state.general.address);
    const issueRequests = useSelector((state: StoreType) => state.issue.issueRequests).get(address);
    const { register, handleSubmit, errors } = useForm<BTCTxIdForm>({ defaultValues: { btcTxId } });
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const onSubmit = handleSubmit(async () => {
        props.closeModal();
    });

    const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "btcTxId" && issueRequests) {
            const txId = value;
            dispatch(changeBtcTxIdAction(txId));
            const request = issueRequests.find((r) => r.id === id);
            if (request) {
                request.btcTxId = txId;

                try {
                    request.confirmations = (await window.polkaBTC.btcCore.getTransactionStatus(request.btcTxId)).confirmations;
                } catch (err) {
                    console.log("Transaction not yet included in Bitcoin.");
                }

                dispatch(updateIssueRequestAction(request));
            } else {
                toast.error(t("issue_page.issue_request_not_found"));
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
                    <h5>{t("issue_page.confirmation")}</h5>
                    <Row className="justify-content-md-center">
                        <Col className="text-left">
                            <p>
                                {" "}
                                <b>{t("issue_page.your_request_processed")}</b>
                                <br />
                                <br />
                                {t("issue_page.monitor_bitcoin")}
                                
                                <br />
                                {t("issue_page.sufficient_confirmations")}                                
                            </p>
                            <p>
                                <b>{t("issue_page.note_hour_to_confirm")}</b>
                            </p>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col className="text-center">
                            <p className="text-left">
                                {t("issue_page.speed_things_up")}
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
                                        message: t("issue_page.valid_transaction_id"),
                                    },
                                })}
                            />
                            {errors.btcTxId && (
                                <div className="input-error">
                                    {errors.btcTxId.type === "required"
                                        ? t("issue_page.required_message")
                                        : errors.btcTxId.message}
                                </div>
                            )}
                            <button className="btn btn-primary" type="submit">
                                {t("issue_page.made_payment")}
                            </button>
                        </Col>
                    </Row>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    {t("previous")}
                </button>
            </Modal.Footer>
        </form>
    );
}
