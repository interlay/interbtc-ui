import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateBTCAddressAction, updateCollateralAction } from "../../../common/actions/vault.actions";
import { planckToDOT, dotToPlanck } from "@interlay/polkabtc";
import { StoreType } from "../../../common/types/util.types";
import BN from "bn.js";
import { BtcNetwork } from "../../../common/utils/utils";
import { useTranslation } from 'react-i18next';


type RegisterVaultForm = {
    collateral: string;
};

type RegisterVaultProps = {
    onClose: () => void;
    onRegister: () => void;
    show: boolean;
};

export default function RegisterVaultModal(props: RegisterVaultProps) {
    const { register, handleSubmit, errors } = useForm<RegisterVaultForm>();
    const [isPending, setIsPending] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const onSubmit = handleSubmit(async ({ collateral }) => {
        if (!polkaBtcLoaded) return;
        setIsPending(true);
        try {
            const collateralAsPlanck = dotToPlanck(collateral.toString());
            if (collateralAsPlanck === undefined) {
                throw new Error("Collateral is smaller than 1 planck");
            }
            const address = await window.vaultClient.registerVault(collateralAsPlanck, BtcNetwork);
            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const collateralPlanck = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
            const collateralDot = new BN(planckToDOT(collateralPlanck.toString()));
            props.onRegister();

            dispatch(updateBTCAddressAction(address));
            dispatch(updateCollateralAction(collateralDot + collateral));

            toast.success("Successfully registered");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        // reset after try-catch
        setIsPending(false);
    });

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("vault.register_vault")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">{t("vault.collateral")}</div>
                        <div className="col-12 basic-addon">
                            <div className="input-group">
                                <input
                                    name="collateral"
                                    type="float"
                                    className={
                                        "form-control custom-input" + (errors.collateral ? " error-borders" : "")
                                    }
                                    aria-describedby="basic-addon2"
                                    ref={register({
                                        required: true,
                                    })}
                                ></input>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">
                                        DOT
                                    </span>
                                </div>
                            </div>
                            {errors.collateral && (
                                <div className="input-error">
                                    {errors.collateral.type === "required"
                                        ? t("vault.collateral_is_required")
                                        : errors.collateral.message}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        {t("cancel")}
                    </Button>
                    <ButtonMaybePending variant="outline-success" type="submit" isPending={isPending}>
                        {t("register")}
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
