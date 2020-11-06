import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import {
    changeAmountBTCAction,
    changeIssueStepAction,
    changeVaultBtcAddressOnIssueAction,
    changeVaultDotAddressOnIssueAction,
} from "../../../common/actions/issue.actions";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, getP2WPKHFromH160 } from "@interlay/polkabtc";

type EnterBTCForm = {
    amountBTC: string;
};

export default function EnterBTCAmount() {
    const [isRequestPending, setRequestPending] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const amount = useSelector((state: StoreType) => state.issue.amountBTC);
    // const feeBTC = useSelector((state: StoreType) => state.issue.feeBTC);
    const defaultValues = amount ? { defaultValues: { amountBTC: amount } } : undefined;
    const { register, handleSubmit, errors } = useForm<EnterBTCForm>(defaultValues);
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ amountBTC }) => {
        if (!polkaBtcLoaded) return;
        setRequestPending(true);
        try {
            const amountSAT = btcToSat(amountBTC);
            if (amountSAT === undefined) {
                throw new Error("Invalid BTC amount input.");
            }
            dispatch(changeAmountBTCAction(amountBTC));
            // FIXME: hardcoded until we have a fee model
            // dispatch(changeFeeBTCAction(amountBTC * 0.005));

            const amount = window.polkaBTC.api.createType("Balance", amountSAT);
            const vaultId = await window.polkaBTC.vaults.selectRandomVaultIssue(amount);

            toast.success("Found vault: " + vaultId.toString());

            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = getP2WPKHFromH160(vault.wallet.address);
            if (vaultBTCAddress === undefined) {
                throw new Error("Vault has invalid BTC address.");
            }
            dispatch(changeVaultBtcAddressOnIssueAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressOnIssueAction(vaultId.toString()));
            dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <p>Please enter the amount of BTC you want to receive in PolkaBTC.</p>
                <input
                    name="amountBTC"
                    type="string"
                    className={"custom-input" + (errors.amountBTC ? " error-borders" : "")}
                    ref={register({ required: true })}
                />
                {errors.amountBTC && (
                    <div className="input-error">
                        {errors.amountBTC.type === "required" ? "Please enter the amount" : errors.amountBTC.message}
                    </div>
                )}
                {/* <p>Fee: {feeBTC} BTC</p> */}
            </Modal.Body>
            <Modal.Footer>
                <ButtonMaybePending
                    className="btn btn-primary float-right"
                    isPending={isRequestPending}
                    onClick={onSubmit}
                >
                    Search Vault
                </ButtonMaybePending>
            </Modal.Footer>
        </form>
    );
}
