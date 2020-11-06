import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BTC_ADDRESS_TESTNET_REGEX } from "../../../constants";
import { useDispatch } from "react-redux";
import { updateBTCAddressAction, updateCollateralAction } from "../../../common/actions/vault.actions";
import { planckToDOT, dotToPlanck } from "@interlay/polkabtc";

type RegisterVaultForm = {
    collateral: string;
    address: string;
}

type RegisterVaultProps = {
    onClose: () => void;
    show: boolean;
};

export default function RegisterVaultModal(props: RegisterVaultProps){
    const { register, handleSubmit, errors } = useForm<RegisterVaultForm>();
    const dispatch = useDispatch();
    const [isPending, setIsPending] = useState(false);

    const onSubmit = handleSubmit(async ({ collateral, address }) => {
        try {
            setIsPending(true);
            const planckColateral = dotToPlanck(collateral.toString());
            await window.vaultClient.registerVault(planckColateral ? planckColateral : "0",address);

            const accountId = await window.vaultClient.getAccountId();    
            const vaultId = window.polkaBTC.api.createType("AccountId",accountId);
            const collateralPlanck = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
            const collateralDot = Number(planckToDOT(collateralPlanck.toString()));

            dispatch(updateBTCAddressAction(address));
            dispatch(updateCollateralAction(collateralDot + collateral));

            toast.success("Successfully registered");
            props.onClose();
            setIsPending(false);
        } catch (error) {
            toast.error(error.toString());
        }
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Vault</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">Collateral</div>
                        <div className="col-12 basic-addon">
                            <div className="input-group">
                                <input
                                    name="collateral"
                                    type="number"
                                    className={"form-control custom-input" + (errors.collateral ? " error-borders" : "")}
                                    aria-describedby="basic-addon2" 

                                    ref={register({
                                        required: true,
                                    })}
                                ></input>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">DOT</span>
                                </div>
                            </div>
                            {errors.collateral && (
                                <div className="input-error">
                                    {errors.collateral.type === "required" ? 
                                    "Collateral is required" : errors.collateral.message}
                                </div>
                            )}
                        </div>
                        <div className="col-12">BTC Address</div>
                        <div className="col-12">
                            <input
                                name="address"
                                type="text"
                                className={"custom-input" + (errors.address ? " error-borders" : "")}
                                ref={register({required: true, pattern: {
                                    value: BTC_ADDRESS_TESTNET_REGEX, 
                                    message: "Please enter valid BTC address"}})}
                            ></input>
                            {errors.address && (
                                <div className="input-error">
                                    {errors.address.type === "required" ? 
                                    "Address is required" : errors.address.message}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending 
                        variant="outline-success" 
                        type="submit"
                        isPending={isPending}>
                        Register
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}