import React, { ChangeEvent } from "react";
import EnterPolkaBTCAmount from "./enter-polkabtc-amount";
import EnterBTCAddress from "./enter-btc-address";
import Confirmation from "./confirmation";
import VaultInfo from "./vault-info";
import { Container, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { StoreType } from "../../types/util.types";
import { RedeemRequest } from "../../types/redeem.types";

export interface RedeemWizardProps {
    handleChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    handleClose: () => void,
    addRedeemRequest: (req: RedeemRequest) => void 
}

export default function RedeemWizard (props: RedeemWizardProps) {
    const step = useSelector((state: StoreType)=> state.redeem.step);

    const handleClose = () => {
        props.handleClose();
    }

    return <Container>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Redeem PolkaBTC
            </Modal.Title>
        </Modal.Header>
        {step === "ENTER_POLKABTC" && <EnterPolkaBTCAmount {...props} />}
        {step === "ENTER_BTC_ADDRESS" && <EnterBTCAddress/>}
        {step === "CONFIRMATION" && <Confirmation/>}
        {step === "VAULT_INFO" && <VaultInfo closeModal={handleClose}/>}
    </Container>
}
