import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { updateBTCAddressAction } from "../../../common/actions/vault.actions";
import ButtonMaybePending from "../../../common/components/pending-button";
import { BtcNetwork } from "../../../common/utils/utils";

type UpdateBTCAddressForm = {};

type UpdateBTCAddressProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateBTCAddressModal(props: UpdateBTCAddressProps) {
    const { handleSubmit } = useForm<UpdateBTCAddressForm>();
    const btcAddress = useSelector((state: StoreType) => state.vault.btcAddress);
    const dispatch = useDispatch();
    const [isUpdatePending, setUpdatePending] = useState(false);

    const onSubmit = handleSubmit(async () => {
        setUpdatePending(true);
        try {
            let btcAddress = await window.vaultClient.updateBtcAddress(BtcNetwork);
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
                        <div className="col-12">
                            Your new BTC address will be automatically created from your BTC wallet connected to the
                            vault client when you click update.
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
