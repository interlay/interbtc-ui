import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateCollateralAction } from "../../../common/actions/vault.actions";
import { planckToDOT, dotToPlanck } from "@interlay/polkabtc";
import { StoreType } from "../../../common/types/util.types";
import BN from "bn.js";
import { isNumeric } from "../../../common/utils/utils";

type UpdateCollateralForm = {
    collateral: string;
};

type UpdateCollateralProps = {
    onClose: () => void;
    show: boolean;
};

export default function UpdateCollateralModal(props: UpdateCollateralProps) {
    const { register, handleSubmit, errors } = useForm<UpdateCollateralForm>();
    const totalCollateralString = useSelector((state: StoreType) => state.vault.collateral);
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ collateral }) => {
        try {
            if (!isNumeric(collateral)) {
                throw new Error("Collateral string must be a positive in");
            }
            const totalCollateralAsPlanckString = dotToPlanck(totalCollateralString);
            const newCollateralAsPlanckString = dotToPlanck(collateral.toString());
            if (totalCollateralAsPlanckString === undefined || newCollateralAsPlanckString === undefined) {
                throw new Error("Collateral is less than 1 planck");
            }
            const totalCollateralAsPlanck = new BN(totalCollateralString);
            const newCollateralAsPlanck = new BN(newCollateralAsPlanckString);
            if (totalCollateralAsPlanck > newCollateralAsPlanck) {
                const collateralToWithdraw = totalCollateralAsPlanck.sub(newCollateralAsPlanck);
                await window.vaultClient.withdrawCollateral(collateralToWithdraw.toString());
            } else {
                const collateralToLock = newCollateralAsPlanck.sub(totalCollateralAsPlanck);
                await window.vaultClient.lockAdditionalCollateral(collateralToLock.toString());
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
    });

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
                        <div className="col-12">New Collateralization 340%</div>
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
