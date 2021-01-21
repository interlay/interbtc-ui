import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
    changeRedeemStepAction,
    changeAmountPolkaBTCAction,
    changeVaultBtcAddressOnRedeemAction,
    changeVaultDotAddressOnRedeemAction,
    updateRedeemFeeAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";
import { useTranslation } from "react-i18next";
import { shortAddress } from "../../../common/utils/utils";
import Big from "big.js";

type EnterPolkaBTCForm = {
    amountPolkaBTC: string;
};

export default function EnterPolkaBTCAmount() {
    const { t } = useTranslation();
    const { balancePolkaBTC, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const { premiumVault } = useSelector((state: StoreType) => state.vault);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount } } : undefined;
    const { register, handleSubmit, errors, getValues } = useForm<EnterPolkaBTCForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [dustValue, setDustValue] = useState("0");
    const dispatch = useDispatch();
    const [premiumPercentage, setPremiumPercentage] = useState(new Big(0));
    const [exchangeRate, setExchangeRate] = useState(new Big(0));
    const [redeemFee, setRedeemFee] = useState("0.5");

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
            setDustValue(dustValueBtc);
            if (premiumVault) {
                const premium = await window.polkaBTC.redeem.getPremiumRedeemFee();
                setPremiumPercentage(new Big(premium));
                const exchangeRate = await window.polkaBTC.oracle.getExchangeRate();
                setExchangeRate(new Big(exchangeRate));
            }

            // TODO: fetch the redeem fee from the parachain
            setRedeemFee("0.5");
        };
        fetchData();
    }, [polkaBtcLoaded, premiumVault]);

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

            let vaultId;
            let vaultBTCAddress;
            if (premiumVault) {
                vaultId = premiumVault.vaultId;
                vaultBTCAddress = premiumVault.btcAddress;
            } else {
                vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
                // get the vault's data
                const vault = await window.polkaBTC.vaults.get(vaultId);
                vaultBTCAddress = vault.wallet.addresses[0];
            }
            // toast.success("Found vault: " + vaultId.toString());

            const fee = await window.polkaBTC.redeem.getFeesToPay(amountPolkaBTC);
            dispatch(updateRedeemFeeAction(fee));

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
                {!premiumVault && (
                    <p>{t("redeem_page.enter_amount_polkabtc", { redeemFee: redeemFee })}</p>
                )}
                <p>
                    {t("redeem_page.you_have")} {balancePolkaBTC} PolkaBTC.
                </p>
                {premiumVault && (
                    <p>
                        {t("redeem_page.redeem_against_selected_vault", {
                            shortAccount: shortAddress(premiumVault.vaultId),
                            premiumDot: getValues("amountPolkaBTC")
                                ? new Big(getValues("amountPolkaBTC")).mul(premiumPercentage).mul(exchangeRate)
                                : 0,
                        })}
                    </p>
                )}
                <p>
                    {t("redeem_page.bitcoin_dust_limit")}({dustValue} BTC)
                    {premiumVault
                        ? t("redeem_page.less_than", {
                            maxValue:
                                premiumVault.lockedBTC > balancePolkaBTC ? premiumVault.lockedBTC : balancePolkaBTC,
                        })
                        : "."}
                </p>
                <div className="row">
                    <div className="col-12 basic-addon">
                        <div className="input-group">
                            <input
                                name="amountPolkaBTC"
                                type="float"
                                className={
                                    "form-control custom-input" + (errors.amountPolkaBTC ? " error-borders" : "")
                                }
                                ref={register({
                                    required: true,
                                    validate: (value) =>
                                        value > balancePolkaBTC
                                            ? t("redeem_page.current_balance") + balancePolkaBTC
                                            : value < Number(dustValue)
                                                ? t("redeem_page.amount_greater") + dustValue + "BTC)."
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
