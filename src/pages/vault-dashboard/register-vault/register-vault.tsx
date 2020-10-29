import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { BTC_ADDRESS_TESTNET_REGEX } from "../../../constants";
import { dispatch } from "rxjs/internal/observable/range";
import { useDispatch } from "react-redux";
import { updateBTCAddressAction, updateCollateralAction } from "../../../common/actions/general.actions";

type RegisterVaultForm = {
    collateral: number;
    address: string;
}

type RegisterVaultProps = {
    onClose: () => void;
    show: boolean;
};

export default function RegisterVaultModal(props: RegisterVaultProps){
    const { register, handleSubmit, errors } = useForm<RegisterVaultForm>();
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ collateral, address }) => {
        try {
            // TO DO CALL API
            // await window.relayer.registerStakedRelayer(collateral, address);
            dispatch(updateBTCAddressAction(address));
            dispatch(updateCollateralAction(collateral));
            toast.success("Successfully registered");
            props.onClose();
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
                        <div className="col-12">
                            <input
                                name="collateral"
                                type="number"
                                className={"custom-input" + (errors.collateral ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                })}
                            ></input>
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
                    <Button variant="outline-success" type="submit">
                        Register
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}