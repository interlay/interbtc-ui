import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { dispatch } from "rxjs/internal/observable/pairs";
import { updateBTCAddressAction } from "../../../common/actions/general.actions";

type UpdateBTCAddressForm = {
    btcAddress: string;
}

type UpdateBTCAddressProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateBTCAddressModal(props: UpdateBTCAddressProps){
    const { register, handleSubmit, errors } = useForm<UpdateBTCAddressForm>();
    const btcAddress = useSelector((state: StoreType) => state.general.btcAddress);
    const dispatch = useDispatch();
    
    const onSubmit = handleSubmit(async ({ btcAddress }) => {
        try {
            dispatch(updateBTCAddressAction(btcAddress));
            toast.success("BTC address successfully updated");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update BTC Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">Current BTC Address:</div>
                        <div className="col-12 btc-address">{btcAddress}</div>
                        <div className="col-12">New BTC Address:</div>
                        <div className="col-12">
                            <input
                                name="btcAddress"
                                type="text"
                                className={"custom-input" + (errors.btcAddress ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                })}
                            ></input>
                            {errors.btcAddress && (
                                <div className="input-error">
                                    {errors.btcAddress.type === "required" ? 
                                    "BTC address is required" : errors.btcAddress.message}
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
                        Update
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}