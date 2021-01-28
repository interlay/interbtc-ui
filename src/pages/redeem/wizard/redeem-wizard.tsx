import React from "react";
import EnterPolkaBTCAmount from "./enter-polkabtc-amount";
import EnterBTCAddress from "./enter-btc-address";
import Confirmation from "./confirmation";
import VaultInfo from "./vault-info";
import { Container, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { useTranslation } from "react-i18next";

export interface RedeemWizardProps {
    handleClose: () => void;
}

export default function RedeemWizard(props: RedeemWizardProps) {
    const step = useSelector((state: StoreType) => state.redeem.step);
    const { t } = useTranslation();

    const handleClose = () => {
        props.handleClose();
    };

    return (
        <Container>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{t("redeem_page.redeem_polkaBTC")}</Modal.Title>
            </Modal.Header>
            {step === "ENTER_POLKABTC" && <EnterPolkaBTCAmount />}
            {step === "ENTER_BTC_ADDRESS" && <EnterBTCAddress />}
            {step === "CONFIRMATION" && <Confirmation />}
            {step === "VAULT_INFO" && <VaultInfo closeModal={handleClose} />}
        </Container>
    );
}
