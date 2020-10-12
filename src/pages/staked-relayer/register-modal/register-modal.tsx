import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/pending-button";

type RegisterModalType = {
    onClose: () => void;
    show: boolean;
};

type RegisterForm = {
    stake: number;
};

export default function ReportModal(props: RegisterModalType): ReactElement {
    const { register, handleSubmit, errors } = useForm<RegisterForm>();
    const stakedRelayer = useSelector((state: StoreType) => state.relayer);
    const [isRegisterPending, setRegisterPending] = useState(false);

    const onSubmit = handleSubmit(async ({ stake }) => {
        if (!stakedRelayer) return;
        setRegisterPending(true);
        try {
            await stakedRelayer.registerStakedRelayer(stake);
            toast.success("Successfully Registered");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setRegisterPending(false);
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-2">
                        <div className="col-12 de-note">
                            Please note there is a default waiting period before bonding.
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">Stake</div>
                        <div className="col-12">
                            <input
                                name="stake"
                                type="number"
                                className={"custom-input" + (errors.stake ? " error-borders" : "")}
                                defaultValue={0}
                                ref={register({
                                    // TODO: validate minimum
                                    required: true,
                                })}
                            ></input>
                            {errors.stake && (
                                <div className="input-error">
                                    {errors.stake.type === "required" ? "stake is required" : errors.stake.message}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending type="submit" isPending={isRegisterPending}>
                        Register
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
