import React, { SyntheticEvent, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateCollateralAction, updateCollateralizationAction } from "../../../common/actions/vault.actions";
import { planckToDOT, dotToPlanck, roundTwoDecimals } from "@interlay/polkabtc";
import { StoreType } from "../../../common/types/util.types";
import Big from "big.js";
import ButtonMaybePending from "../../../common/components/pending-button";
import { useTranslation } from 'react-i18next';


type UpdateCollateralForm = {
    collateral: string;
};

type UpdateCollateralProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateCollateralModal(props: UpdateCollateralProps) {
    const { polkaBtcLoaded, vaultClientLoaded } = useSelector((state: StoreType) => state.general);
    const { register, handleSubmit, errors } = useForm<UpdateCollateralForm>();
    // denoted in DOT
    const currentDOTCollateral = useSelector((state: StoreType) => state.vault.collateral);
    // denoted in planck
    const [newCollateral, setNewCollateral] = useState("");
    // denoted in planck
    const [currentCollateral, setCurrentCollateral] = useState("");
    const [newCollateralization, setNewCollaterlization] = useState("∞");

    const [isAWithdrawal, setIsAWithdrawal] = useState(false);
    const [isUpdatePending, setUpdatePending] = useState(false);
    const [isCollateralUpdateAllowed, setCollateralUpdateAllowed] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onSubmit = handleSubmit(async () => {
        if (!polkaBtcLoaded) return;
        if (!vaultClientLoaded) return;

        setUpdatePending(true);
        try {
            const newCollateralBN = new Big(newCollateral);
            const currentCollateralBN = new Big(currentCollateral);

            if (currentCollateralBN.gt(newCollateralBN)) {
                const withdrawAmount = currentCollateralBN.sub(newCollateralBN);
                await window.vaultClient.withdrawCollateral(withdrawAmount.toString());
            } else if (currentCollateralBN.lt(newCollateralBN)) {
                const depositAmount = newCollateralBN.sub(currentCollateralBN);
                await window.vaultClient.lockAdditionalCollateral(depositAmount.toString());
            } else {
                closeModal();
                return;
            }

            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
            const collateralDotString = planckToDOT(balanceLockedDOT.toString());

            dispatch(updateCollateralAction(collateralDotString));
            let collateralization;
            try {
                collateralization = new Big(parseFloat(newCollateralization) / 100);
            } catch {
                collateralization = undefined;
            }
            dispatch(updateCollateralizationAction(collateralization?.mul(100).toString()));

            toast.success(t("vault.successfully_updated_collateral"));
            closeModal();
        } catch (error) {
            toast.error(error.toString());
        }
        setUpdatePending(false);
    });

    const closeModal = () => {
        props.onClose();
        setNewCollaterlization("");
    };

    const onChange = async (obj: SyntheticEvent) => {
        try {
            const value = (obj.target as HTMLInputElement).value;
            if (value === "" || !polkaBtcLoaded || Number(value) <= 0 || isNaN(Number(value)) || !vaultClientLoaded) {
                setCollateralUpdateAllowed(false);
                return;
            }

            const newCollateral = dotToPlanck(value);
            if (!newCollateral) {
                throw new Error("Please enter an amount greater than 1 Planck");
            }
            setNewCollateral(newCollateral);

            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const requiredCollateral = (await window.polkaBTC.vaults.getRequiredCollateralForVault(vaultId)).toString();

            // collateral update only allowed if above required collateral
            const allowed = new Big(newCollateral).gte(new Big(requiredCollateral));
            setCollateralUpdateAllowed(allowed);

            // decide if we withdraw or add collateral
            const currentCollateral = dotToPlanck(currentDOTCollateral);
            if (!currentCollateral) {
                throw new Error("Error with current vault collateral");
            }
            setCurrentCollateral(currentCollateral);
            const withdraw = new Big(newCollateral).lt(currentCollateral);
            withdraw ? setIsAWithdrawal(true) : setIsAWithdrawal(false);

            // get the updated collateralization
            const newCollateralAsU128 = window.polkaBTC.api.createType("u128", newCollateral);
            const newCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(
                vaultId,
                newCollateralAsU128
            );
            if (newCollateralization !== undefined) {
                setNewCollaterlization(newCollateralization.toString());
            } else {
                setNewCollaterlization("∞");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Modal show={props.show} onHide={closeModal}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("vault.update_collateral")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12 current-collateral">
                            {t("vault.current_total_collateral",{currentDOTCollateral})}
                        </div>
                        <div className="col-12">{t("vault.new_total_collateral")}</div>
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
                                        min: 0,
                                    })}
                                    onChange={onChange}
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
                                    {errors.collateral.type === "min"
                                        ? t("vault.collateral_higher_than_0")
                                        : errors.collateral.message}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            {t("vault.new_collateralization")}
                            {newCollateralization !== "∞"
                                ? Number(newCollateralization) > 1000
                                    ? " more than 1000%"
                                    : " " + roundTwoDecimals(newCollateralization || "0") + "%"
                                : " " + newCollateralization}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        {t("cancel")}
                    </Button>
                    <ButtonMaybePending
                        variant={isAWithdrawal ? "outline-danger" : "outline-success"}
                        isPending={isUpdatePending}
                        type="submit"
                        disabled={!isCollateralUpdateAllowed}
                    >
                        {isAWithdrawal ? t("vault.withdraw_collateral") : t("vault.add_collateral")}
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
