import React, { useState, useEffect } from "react";
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
import { encodeBitcoinAddress } from "../../../common/utils/utils";
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
    const [dustValue, setDustValue] = useState("0");
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDustValue = async () => {
            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
            setDustValue(dustValueBtc);
        };
        fetchDustValue();
    });

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

            const vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
            toast.success("Found vault: " + vaultId.toString());

            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = encodeBitcoinAddress(vault.wallet.address);

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
                <p>Please enter an amount greater than Bitcoin dust limit({dustValue} BTC).</p>
                <div className="row">
                    <div className="col-12 basic-addon">
                        <div className="input-group">
                            <input
                                name="amountPolkaBTC"
                                type="float"
                                className={"form-control custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")}
                                ref={register({
                                    required: true,
                                    validate: (value) =>
                                        value > balancePolkaBTC
                                            ? "Please enter an amount smaller than your current balance: " + balancePolkaBTC
                                            : value < Number(dustValue) ? 
                                                "Please enter an amount greater than Bitcoin dust limit" + "(" + dustValue + "BTC)."
                                                : undefined,
                                })}
                            />
                            <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2">
                                    PolkaBTC
                                </span>
                            </div>
                        </div>
                        {errors.amountPolkaBTC && (
                            <div className="input-error">
                                {errors.amountPolkaBTC.type === "required"
                                    ? "Please enter the amount"
                                    : errors.amountPolkaBTC.message}
                            </div>
                        )}
                    </div>
                </div>
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
