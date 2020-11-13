import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { updateBTCAddressAction } from "../../../common/actions/vault.actions";
import { BTC_ADDRESS_REGEX } from "../../../constants";
import ButtonMaybePending from "../../../common/components/pending-button";
import { getH160FromAddress } from "../../../common/utils/utils";

type UpdateBTCAddressForm = {
    btcAddress: string;
};

type UpdateBTCAddressProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateBTCAddressModal(props: UpdateBTCAddressProps) {
    const { register, handleSubmit, errors } = useForm<UpdateBTCAddressForm>();
    const btcAddress = useSelector((state: StoreType) => state.vault.btcAddress);
    const dispatch = useDispatch();
    const [isUpdatePending, setUpdatePending] = useState(false);

    const onSubmit = handleSubmit(async ({ btcAddress }) => {
        setUpdatePending(true);
        try {
            const btcHash = getH160FromAddress(btcAddress);
            if (!btcHash) {
                throw new Error("Invalid address");
            }
            await window.vaultClient.updateBtcAddress(btcHash);
            dispatch(updateBTCAddressAction(btcAddress));
            toast.success("BTC address successfully updated");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setUpdatePending(false);
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
                                    pattern: {
                                        value: BTC_ADDRESS_REGEX,
                                        message: "Please enter valid BTC address",
                                    },
                                })}
                            ></input>
                            {errors.btcAddress && (
                                <div className="input-error">
                                    {errors.btcAddress.type === "required"
                                        ? "BTC address is required"
                                        : errors.btcAddress.message}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending variant="outline-success" isPending={isUpdatePending} type="submit">
                        Update
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
