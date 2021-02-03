import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { calculateAmount, updateBalances } from "../../../common/utils/utils";
import { btcToSat } from "@interlay/polkabtc";
import { updateBalancePolkaBTCAction } from "../../../common/actions/general.actions";
import Big from "big.js";
import { toast } from "react-toastify";


type TransferForm = {
    amountPolkaBTC: string;
    address: string;
};

export default function Transfer() {
    const { t } = useTranslation();
    const senderAddress = useSelector((state: StoreType) => state.general.address);
    const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
    const { balancePolkaBTC, balanceDOT } = useSelector((state: StoreType) => state.general);
    const defaultValues = { defaultValues: { amountPolkaBTC: "", btcAddress: "" } };
    const { register, handleSubmit, errors, getValues } = useForm<TransferForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [usdAmount, setUsdAmount] = useState("0");
    const dispatch = useDispatch();

    const onSubmit = handleSubmit(async ({ amountPolkaBTC, address }) => {
        setRequestPending(true);
        try {
            window.polkaBTC.treasury.setAccount(senderAddress);
            await window.polkaBTC.treasury.transfer(address,btcToSat(amountPolkaBTC));
            dispatch(updateBalancePolkaBTCAction((new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC))).toString()));
            updateBalances(dispatch,address,balanceDOT,balancePolkaBTC);
            toast.success(t("successful_transfer"));
        } catch(error) {
            console.log(error);
        }
        setRequestPending(false);
    });

    return <div className="transfer">
         <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-6">
                    <input
                        id="amount-btc-input"
                        name="amountPolkaBTC"
                        type="float"
                        placeholder="0.00"
                        className={"" + (errors.amountPolkaBTC ? " error-borders" : "")}
                        onChange={() => {
                            setUsdAmount(calculateAmount(getValues("amountPolkaBTC") || "0",usdPrice));
                        }}
                        ref={register({
                            required: true
                        })}
                    />
                </div>
                <div className="col-6 mark-currency">
                    PolkaBTC
                </div>
            </div>
            <div className="row usd-price">
                <div className="col">
                    {"= $"+ usdAmount}
                </div>
            </div>
            {errors.amountPolkaBTC && (
                <div className="wizard-input-error">
                    {errors.amountPolkaBTC.type === "required"
                        ? t("redeem_page.please_enter_amount")
                        : errors.amountPolkaBTC.message}
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div className="input-address-wrapper">
                        <div className="address-label">
                            {t("recipient")}
                        </div>
                        <input
                            id="btc-address-input"
                            name="address"
                            type="string"
                            className={"" + (errors.address ? " error-borders" : "")}
                            placeholder={t("address")}
                            ref={register({
                                required: true
                            })}
                        />
                    </div>
                </div>
            </div>
            {errors.address && (
                <div className="address-input-error">
                    {errors.address.type === "required"
                        ? t("enter_recipient_address")
                        : errors.address.message}
                </div>
            )}
            <div className="mb-5"></div>
            <ButtonMaybePending
                className="btn btn-primary app-btn"
                isPending={isRequestPending}
                onClick={onSubmit}
            >
                {t("transfer")}
            </ButtonMaybePending>
        </form>
    </div>
}
