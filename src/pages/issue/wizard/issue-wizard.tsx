import React from "react";
import { Container, Modal } from "react-bootstrap";
import RequestConfirmation from "./request-confirmation";
import EnterBTCAmount from "./enter-btc-amount";
import BTCPayment from "./btc-payment";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";


export interface IssueWizardProps {
    handleClose: () => void,
}

export default function IssueWizard(props: IssueWizardProps) {
    const step = useSelector((state: StoreType) => state.issue.step);
    const { t } = useTranslation();

    const handleClose = () => {
        props.handleClose();
    }

    return <Container>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {t("issue_page.issue_polkabtc")}
             </Modal.Title>
        </Modal.Header>
        {step === "ENTER_BTC_AMOUNT" && <EnterBTCAmount />}
        {step === "REQUEST_CONFIRMATION" && <RequestConfirmation />}
        {step === "BTC_PAYMENT" && <BTCPayment closeModal={handleClose}/>}
    </Container>
}
