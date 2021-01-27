import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Prices, StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { calculateAmount } from "../../../common/utils/utils";
import { btcToSat } from "@interlay/polkabtc";


type TransferForm = {
    amountPolkaBTC: string;
    address: string;
};

export default function Transfer() {
    const { t } = useTranslation();
    const senderAddress = useSelector((state: StoreType) => state.general.address);
    const defaultValues = { defaultValues: { amountPolkaBTC: "", btcAddress: "" } };
    const { register, handleSubmit, errors, getValues } = useForm<TransferForm>(defaultValues);
    const [usdPrice, setUsdPrice] = useState("0");
    const [isRequestPending, setRequestPending] = useState(false);
    const [usdAmount, setUsdAmount] = useState(calculateAmount("0",usdPrice));


    useEffect(() => {
        const fetchData = async () => {
            fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then((response) => {
                return response.json() as Promise<Prices>;
            }).then((prices) => {
                setUsdPrice(prices.bitcoin.usd.toString());   
                const amount = calculateAmount(getValues("amountPolkaBTC") || "0",prices.bitcoin.usd.toString());
                setUsdAmount(amount); 
            });
        };
        fetchData();
    });

    const onSubmit = handleSubmit(async ({ amountPolkaBTC, address }) => {
        setRequestPending(true);
        try {
            window.polkaBTC.treasury.setAccount(senderAddress);
            await window.polkaBTC.treasury.transferPolkaBTC(address,btcToSat(amountPolkaBTC));
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
