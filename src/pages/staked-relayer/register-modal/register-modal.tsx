import React, { ReactElement, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { toast } from "react-toastify";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useTranslation } from "react-i18next";
import { dotToPlanck } from "@interlay/polkabtc";

type RegisterModalType = {
    onClose: () => void;
    onRegister: () => void;
    show: boolean;
};

type RegisterForm = {
    stake: number;
};

export default function ReportModal(props: RegisterModalType): ReactElement {
    const { register, handleSubmit, errors } = useForm<RegisterForm>();
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);
    const [isRegisterPending, setRegisterPending] = useState(false);
    const { t } = useTranslation();

    const onSubmit = handleSubmit(async ({ stake }) => {
        if (!relayerLoaded) return;
        setRegisterPending(true);
        try {
            const planckStake = parseFloat(dotToPlanck(stake.toString()) || "0");
            await window.relayer.registerStakedRelayer(planckStake);
            toast.success("Successfully Registered");
            props.onRegister();
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
                    <Modal.Title>{t("relayer.registration")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-2">
                        <div className="col-12 de-note">{t("relayer.please_note")}</div>
                    </div>
                    <div className="row">
                        <div className="col-12">{t("relayer.stake")}</div>
                        <div className="col-12 basic-addon">
                            <div className="input-group">
                                <input
                                    name="stake"
                                    type="float"
                                    className={"form-control custom-input" + (errors.stake ? " error-borders" : "")}
                                    defaultValue={0}
                                    aria-describedby="basic-addon2"
                                    ref={register({
                                        // TODO: validate minimum
                                        required: true,
                                    })}
                                ></input>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">
                                        {t("dot")}
                                    </span>
                                </div>
                            </div>
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
                        {t("cancel")}
                    </Button>
                    <ButtonMaybePending type="submit" isPending={isRegisterPending}>
                        {t("register")}
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
