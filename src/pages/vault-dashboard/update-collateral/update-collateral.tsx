import React, { SyntheticEvent, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateCollateralAction } from "../../../common/actions/vault.actions";
import { planckToDOT, dotToPlanck } from "@interlay/polkabtc";
import { StoreType } from "../../../common/types/util.types";
import BN from "bn.js";
import { isPositiveNumeric } from "../../../common/utils/utils";
import { DOT } from "@interlay/polkabtc/build/interfaces/default";
import ButtonMaybePending from "../../../common/components/pending-button";

type UpdateCollateralForm = {
    collateral: string;
};

type UpdateCollateralProps = {
    onClose: () => void;
    show: boolean;
};

function parseOldAndNewCollateral(oldCollateral: string, newCollateral: string): [BN, BN] {
    if (!isPositiveNumeric(newCollateral)) {
        throw new Error("Collateral string must be a positive number");
    }
    const oldCollateralAsPlanckString = dotToPlanck(oldCollateral);
    const newCollateralAsPlanckString = dotToPlanck(newCollateral);
    if (oldCollateralAsPlanckString === undefined || newCollateralAsPlanckString === undefined) {
        throw new Error("Collateral is less than 1 planck");
    }
    const oldCollateralAsPlanck = new BN(oldCollateralAsPlanckString);
    const newCollateralAsPlanck = new BN(newCollateralAsPlanckString);

    return [oldCollateralAsPlanck, newCollateralAsPlanck];
}

export default function UpdateCollateralModal(props: UpdateCollateralProps) {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const vaultClientLoaded = useSelector((state: StoreType) => state.general.vaultClientLoaded);
    const { register, handleSubmit, errors } = useForm<UpdateCollateralForm>();
    const totalCollateralString = useSelector((state: StoreType) => state.vault.collateral);
    const dispatch = useDispatch();
    const [isAWithdrawal, setIsAWithdrawal] = useState(false);
    const [isUpdatePending, setUpdatePending] = useState(false);
    const [newCollaterlization, setNewCollaterlization] = useState("∞");

    const onSubmit = handleSubmit(async ({ collateral }) => {
        if (!polkaBtcLoaded) return;
        if (!vaultClientLoaded) return;

        setUpdatePending(true);
        try {
            const [totalCollateralAsPlanck, newCollateralAsPlanck] = parseOldAndNewCollateral(
                totalCollateralString,
                collateral
            );
            if (totalCollateralAsPlanck.gt(newCollateralAsPlanck)) {
                const collateralToWithdraw = totalCollateralAsPlanck.sub(newCollateralAsPlanck);
                await window.vaultClient.withdrawCollateral(collateralToWithdraw.toString());
            } else if (totalCollateralAsPlanck.lt(newCollateralAsPlanck)) {
                const collateralToLock = newCollateralAsPlanck.sub(totalCollateralAsPlanck);
                await window.vaultClient.lockAdditionalCollateral(collateralToLock.toString());
            } else {
                props.onClose();
                return;
            }

            const accountId = await window.vaultClient.getAccountId();
            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
            const collateralDotString = planckToDOT(balanceLockedDOT.toString());
            dispatch(updateCollateralAction(collateralDotString));
            toast.success("Successfully updated collateral");
            props.onClose();
        } catch (error) {
            toast.error(error.toString());
        }
        setUpdatePending(false);
    });

    const onChange = async (obj: SyntheticEvent) => {
        if (!vaultClientLoaded) return;

        const targetObject = obj.target as HTMLInputElement;
        const newCollateralString = targetObject.value;
        if (newCollateralString === "" || !polkaBtcLoaded) {
            return;
        }
        const [totalCollateralAsPlanck, newCollateralAsPlanck] = parseOldAndNewCollateral(
            totalCollateralString,
            newCollateralString
        );

        if (newCollateralAsPlanck.lt(totalCollateralAsPlanck)) {
            setIsAWithdrawal(true);
        } else {
            setIsAWithdrawal(false);
        }

        const accountId = await window.vaultClient.getAccountId();
        const vaultId = window.polkaBTC.api.createType("AccountId", accountId);

        const newCollateralAsDOT = window.polkaBTC.api.createType("u128", newCollateralAsPlanck) as DOT;
        const newCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(
            vaultId,
            newCollateralAsDOT
        );
        if (newCollateralization !== undefined) {
            setNewCollaterlization(newCollateralization.toString());
        } else {
            setNewCollaterlization("∞");
        }
    };

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Collateral</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12 current-collateral">
                            Current Total Collateral {totalCollateralString} DOT{" "}
                        </div>
                        <div className="col-12">New Total Collateral</div>
                        <div className="col-12 basic-addon">
                            <div className="input-group">
                                <input
                                    name="collateral"
                                    type="number"
                                    className={
                                        "form-control custom-input" + (errors.collateral ? " error-borders" : "")
                                    }
                                    aria-describedby="basic-addon2"
                                    ref={register({
                                        required: true,
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
                                        ? "Collateral is required"
                                        : errors.collateral.message}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            New Collateralization {newCollaterlization}
                            {newCollaterlization !== "∞" ? "%" : ""}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onClose}>
                        Cancel
                    </Button>
                    <ButtonMaybePending
                        variant={isAWithdrawal ? "outline-danger" : "outline-success"}
                        isPending={isUpdatePending}
                        type="submit"
                    >
                        {isAWithdrawal ? "Withdraw Collateral" : "Add Collateral"}
                    </ButtonMaybePending>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
