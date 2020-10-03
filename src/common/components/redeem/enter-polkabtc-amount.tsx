import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/util.types";
import { useForm } from "react-hook-form";
import { changeRedeemStepAction, changeAmountPolkaBTCAction, changeVaultBtcAddressAction, changeVaultDotAddressAction } from "../../actions/redeem.actions";
import { toast } from "react-toastify";
import ButtonMaybePending from "../pending-button";

interface EnterPolkaBTCAmountProps {
    handleChange?: (props: any) => void,
}

type EnterPolkaBTCForm = {
    amountPolkaBTC: number;
};

export default function EnterPolkaBTCAmount(props: EnterPolkaBTCAmountProps) {
    const [isRequestPending, setRequestPending] = useState(false);
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount } } : undefined;
    const { register, handleSubmit, errors } = useForm<EnterPolkaBTCForm>(defaultValues);
    // TODO: get from storage
    const balancePolkaBTC = "2000";
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ amountPolkaBTC }) => {
        setRequestPending(true);
        try {
            dispatch(changeAmountPolkaBTCAction(amountPolkaBTC));
            const amount = polkaBTC.api.createType("Balance", amountPolkaBTC);
            const vaultId = await polkaBTC.vaults.selectRandomVaultRedeem(amount);

            // get the vault's data
            const vault = await polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = vault.btc_address.toString();

            dispatch(changeVaultBtcAddressAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressAction(vaultId.toString()));
            dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
        } catch (error) {
            toast.error(error.toString());
        }
    })

    return <form onSubmit={onSubmit}>
        <Modal.Body>
            <p>Please enter the amount of BTC you want to receive in PolkaBTC.</p>
            <p>You have {balancePolkaBTC} PolkaBTC</p>
            <input
                name="amountPolkaBTC"
                type="number"
                className={"custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")}
                ref={register({
                    required: true, max: {
                        value: balancePolkaBTC,
                        message: "Please enter amount less then " + balancePolkaBTC
                    }
                })}
            />
            {errors.amountPolkaBTC && (<div className="input-error">
                {errors.amountPolkaBTC.type === "required" ? "Please enter the amount"
                    : errors.amountPolkaBTC.message}
            </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <ButtonMaybePending className="btn btn-primary float-right" isPending={isRequestPending} onClick={onSubmit}>
                Search Vault
            </ButtonMaybePending>
        </Modal.Footer>
    </form>
}