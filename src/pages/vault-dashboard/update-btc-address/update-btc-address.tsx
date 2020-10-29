import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type UpdateBTCAddressForm = {
    btcAddress: string;
}

type UpdateBTCAddressProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateBTCAddressModal(props: UpdateBTCAddressProps){
    const { register, handleSubmit, errors } = useForm<UpdateBTCAddressForm>();
    
    const onSubmit = handleSubmit(async ({ btcAddress }) => {
        try {
            // TO DO CALL API
            toast.success("Successfully updated address");
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
                        <div className="col-12 btc-address">ab327193861491aff23768af782fab372</div>
                        <div className="col-12">New BTC Address:</div>
                        <div className="col-12">
                            <input
                                name="btcAddress"
                                type="text"
                                className={"custom-input" + (errors.btcAddress ? " error-borders" : "")}
                                defaultValue={0}
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