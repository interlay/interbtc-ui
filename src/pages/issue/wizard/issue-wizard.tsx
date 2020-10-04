import React from "react";
import { Container, Modal } from "react-bootstrap";
import RequestConfirmation from "./request-confirmation";
import EnterBTCAmount from "./enter-btc-amount";
import BTCPayment from "./btc-payment";
import BTCPaymentConfirmation from "./btc-payment-confirmation";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";

export interface IssueWizardProps {
    handleClose: () => void,
}

export default function IssueWizard(props: IssueWizardProps) {
    const step = useSelector((state: StoreType) => state.issue.step);

    const handleClose = () => {
        props.handleClose();
    }

    return <Container>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Issue PolkaBTC
             </Modal.Title>
        </Modal.Header>
        {step === "ENTER_BTC_AMOUNT" && <EnterBTCAmount />}
        {step === "REQUEST_CONFIRMATION" && <RequestConfirmation />}
        {step === "BTC_PAYMENT" && <BTCPayment />}
        {step === "BTC_PAYMENT_CONFIRMATION" && <BTCPaymentConfirmation closeModal={handleClose}/>}
    </Container>
}
