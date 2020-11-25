import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
    changeRedeemStepAction,
    changeAmountPolkaBTCAction,
    changeVaultBtcAddressOnRedeemAction,
    changeVaultDotAddressOnRedeemAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC } from "@interlay/polkabtc";
import { getAddressFromH160 } from "../../../common/utils/utils";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";

type EnterPolkaBTCForm = {
    amountPolkaBTC: string;
};

export default function EnterPolkaBTCAmount() {
    const balancePolkaBTC = useSelector((state: StoreType) => state.general.balancePolkaBTC);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount } } : undefined;
    const { register, handleSubmit, errors } = useForm<EnterPolkaBTCForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ amountPolkaBTC }) => {
        if (!polkaBtcLoaded) return;

        console.log(errors);

        setRequestPending(true);
        try {
            const amountPolkaSAT = btcToSat(amountPolkaBTC);
            if (amountPolkaSAT === undefined) {
                throw new Error("Invalid PolkaBTC amount input");
            }
            const amountPolkaBTCInteger = amountPolkaBTC.split(".")[0];
            if (amountPolkaBTCInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
                throw new Error("Input value is too high");
            }
            dispatch(changeAmountPolkaBTCAction(amountPolkaBTC));
            const amountAsSatoshi = window.polkaBTC.api.createType("Balance", amountPolkaSAT);
            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            if (amountAsSatoshi.lte(dustValueAsSatoshi)) {
                const dustValue = satToBTC(dustValueAsSatoshi.toString());
                throw new Error(`Please enter an amount greater than Bitcoin dust (${dustValue} BTC)`);
            }

            const vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
            toast.success("Found vault: " + vaultId.toString());

            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = getAddressFromH160(vault.wallet.address);
            if (vaultBTCAddress === undefined) {
                throw new Error("Vault has invalid BTC address.");
            }

            dispatch(changeVaultBtcAddressOnRedeemAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressOnRedeemAction(vaultId.toString()));
            dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <p>Please enter the amount of PolkaBTC you want to receive in BTC.</p>
                <p>You have {balancePolkaBTC} PolkaBTC</p>
                <input
                    name="amountPolkaBTC"
                    type="float"
                    className={"custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")}
                    ref={register({
                        required: true,
                        max: {
                            value: balancePolkaBTC,
                            message: "Please enter an amount smaller than your current balance: " + balancePolkaBTC,
                        },
                    })}
                />
                {errors.amountPolkaBTC && (
                    <div className="input-error">
                        {errors.amountPolkaBTC.type === "required"
                            ? "Please enter the amount"
                            : errors.amountPolkaBTC.message}
                        {errors.amountPolkaBTC.type === "validate" &&
                            "Please enter amount less then " + balancePolkaBTC}
                    </div>
                )}
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
