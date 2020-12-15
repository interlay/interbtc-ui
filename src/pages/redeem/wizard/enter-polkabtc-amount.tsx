import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
    changeRedeemStepAction,
    changeAmountPolkaBTCAction,
    changeVaultBtcAddressOnRedeemAction,
    changeVaultDotAddressOnRedeemAction,
    updateRedeemFeeAction
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC } from "@interlay/polkabtc";
import { encodeBitcoinAddress } from "../../../common/utils/utils";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";
import { useTranslation } from 'react-i18next';


type EnterPolkaBTCForm = {
    amountPolkaBTC: string;
};

export default function EnterPolkaBTCAmount() {
    const { t } = useTranslation();
    const { balancePolkaBTC, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
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

            const amount = window.polkaBTC.api.createType("Balance", amountPolkaBTC);
            const fee = await window.polkaBTC.redeem.getFeesToPay(amount);
            dispatch(updateRedeemFeeAction(fee.toString()));
            
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
                <p>{t("redeem_page.enter_amount_polkabtc")}</p>
                <p>{t("redeem_page.you_have")} {balancePolkaBTC} PolkaBTC</p>
                <p>{t("redeem_page.bitcoin_dust_limit")}({dustValue} BTC).</p>
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
                                            ? t("redeem_page.current_balance") + balancePolkaBTC
                                            : value < Number(dustValue) ? 
                                                t("redeem_page.amount_greater") + dustValue + "BTC)."
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
                                    ? t("redeem_page.please_enter_amount")
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
                    {t("search_vault")}
                </ButtonMaybePending>
            </Modal.Footer>
        </form>
    );
}
