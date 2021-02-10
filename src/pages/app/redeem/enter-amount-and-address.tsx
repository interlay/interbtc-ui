import React, { useState, useEffect, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
    changeRedeemStepAction,
    changeAmountPolkaBTCAction,
    changeVaultBtcAddressOnRedeemAction,
    changeVaultDotAddressOnRedeemAction,
    updateRedeemFeeAction,
    changeBTCAddressAction,
    changeRedeemIdAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC, stripHexPrefix } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH, BTC_ADDRESS_REGEX } from "../../../constants";
import { useTranslation } from "react-i18next";
import BitcoinLogo from "../../../assets/img/Bitcoin-Logo.png";
import PolkadotLogo from "../../../assets/img/Polkadot-Logo.png";
import Big from "big.js";
import { updateBalancePolkaBTCAction } from "../../../common/actions/general.actions";
import { calculateAmount } from "../../../common/utils/utils";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces";
import { AccountId } from "@polkadot/types/interfaces/runtime";
import BN from "bn.js";

type AmountAndAddressForm = {
    amountPolkaBTC: string;
    btcAddress: string;
};

type PremiumRedeemVault = Map<AccountId, PolkaBTC>;

export default function EnterAmountAndAddress(): ReactElement {
    const { t } = useTranslation();
    const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
    const { balancePolkaBTC, polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount, btcAddress: "" } } : undefined;
    const { register, handleSubmit, errors, getValues } = useForm<AmountAndAddressForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [dustValue, setDustValue] = useState("0");
    const dispatch = useDispatch();
    const [usdAmount, setUsdAmount] = useState("");
    const [redeemFee, setRedeemFee] = useState("0");
    const [btcToDotRate, setBtcToDotRate] = useState(new Big(0));
    const [premiumRedeem, setPremiumRedeem] = useState(false);
    const [maxPremiumRedeem, setMaxPremiumRedeem] = useState(new Big(0));
    const [premiumRedeemVaults, setPremiumRedeemVaults] = useState(new Map() as PremiumRedeemVault);
    const [premiumRedeemFee, setPremiumRedeemFee] = useState(new Big(0));

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            // redeems can only be made above the BTC dust limit
            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
            setDustValue(dustValueBtc);

            // check if vaults below the premium redeem limit are in the system
            try {
                const premiumRedeemVaults = await window.polkaBTC.vaults.getPremiumRedeemVaults();
                setPremiumRedeemVaults(premiumRedeemVaults);

                const [premiumRedeemFee, btcToDot] = await Promise.all([
                    window.polkaBTC.redeem.getPremiumRedeemFee(),
                    window.polkaBTC.oracle.getExchangeRate(),
                ]);
                setPremiumRedeemFee(new Big(premiumRedeemFee));
                setBtcToDotRate(btcToDot);
            } catch (e) {
                console.log(e);
            }
        };
        setUsdAmount(calculateAmount(amount || getValues("amountPolkaBTC") || "0", usdPrice));
        fetchData();
    }, [polkaBtcLoaded, getValues, usdPrice, amount]);

    const onSubmit = handleSubmit(async ({ amountPolkaBTC, btcAddress }) => {
        if (!polkaBtcLoaded) return;

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

            // differentiate between premium and regular redeem
            let vaultId;
            if (!premiumRedeem) {
                // select a random vault
                vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
            } else {
                // select a vault from the premium redeem vault list
                for (const [id, redeemableTokens] of premiumRedeemVaults) {
                    const redeemable = redeemableTokens.toBn();
                    if (redeemable.gte(new BN(amountPolkaSAT))) {
                        vaultId = id;
                        break;
                    }
                }
                if (vaultId === undefined) {
                    // TODO: add to translation
                    const msg =
                        "Could not find Vault below premium redeem threshold with sufficient locked PolkaBTC." +
                        "Please try a different Vault. The maximum amount for premium redeem " +
                        `is ${maxPremiumRedeem.toString()} PolkaBTC.`;

                    throw new Error(msg);
                }
            }
            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = vault.wallet.addresses[0];
            const fee = await window.polkaBTC.redeem.getFeesToPay(amountPolkaBTC);
            dispatch(updateRedeemFeeAction(fee));

            dispatch(changeVaultBtcAddressOnRedeemAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressOnRedeemAction(vaultId.toString()));
            dispatch(changeBTCAddressAction(btcAddress));

            const amount = window.polkaBTC.api.createType("Balance", amountPolkaSAT);
            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultId.toString());
            const requestResult = await window.polkaBTC.redeem.request(amount, btcAddress, vaultAccountId);

            // get the redeem id from the request redeem event
            const id = stripHexPrefix(requestResult.id.toString());

            // update the redeem status
            dispatch(changeRedeemIdAction(id));
            dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC)).toString()));
            dispatch(changeRedeemStepAction("REDEEM_INFO"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    const calculateTotalBTC = (): string => {
        const amount = getValues("amountPolkaBTC") || "0";
        if (amount === "0") return "0";
        return new Big(amount).sub(new Big(redeemFee)).toString();
    };

    const calculateTotalDOT = (): string => {
        const amount = getValues("amountPolkaBTC") || "0";
        if (amount === "0") return "0";
        return new Big(amount).mul(btcToDotRate).mul(premiumRedeemFee).toString();
    };

    const onAmountChange = async () => {
        const amount = getValues("amountPolkaBTC") || "0";
        setUsdAmount(calculateAmount(amount, usdPrice));
        const fee = await window.polkaBTC.redeem.getFeesToPay(amount);
        setRedeemFee(fee);
    };

    const checkAddress = () => {
        if (!address) {
            toast.warning(t("redeem_page.must_select_account_warning"));
            return;
        }
    };

    const togglePremium = () => {
        if (!premiumRedeem) {
            let maxAmount = new BN(0);
            for (const redeemableTokens of premiumRedeemVaults.values()) {
                const redeemable = redeemableTokens.toBn();
                if (maxAmount.lt(redeemable)) {
                    maxAmount = redeemable;
                }
            }
            const maxBtc = satToBTC(maxAmount.toString());
            setMaxPremiumRedeem(new Big(maxBtc));
            console.log(maxPremiumRedeem.toString());
        }
        setPremiumRedeem(!premiumRedeem);
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-6">
                    <input
                        id="amount-btc-input"
                        name="amountPolkaBTC"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        className={"" + (errors.amountPolkaBTC ? " error-borders" : "")}
                        onChange={onAmountChange}
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
                </div>
                <div className="col-6 mark-currency">PolkaBTC</div>
            </div>
            <div className="row usd-price">
                <div className="col">{"= $" + usdAmount}</div>
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
                        <div className="address-label">{t("destination")}</div>
                        <input
                            id="btc-address-input"
                            name="btcAddress"
                            type="string"
                            className={"" + (errors.btcAddress ? " error-borders" : "")}
                            placeholder="Enter Bitcoin Address"
                            ref={register({
                                required: true,
                                pattern: {
                                    // FIXME: regex need to depend on global mainnet | testnet parameter
                                    value: BTC_ADDRESS_REGEX,
                                    message: t("redeem_page.valid_btc_address"),
                                },
                            })}
                        />
                    </div>
                </div>
            </div>
            {errors.btcAddress && (
                <div className="address-input-error">
                    {errors.btcAddress.type === "required" ? t("redeem_page.enter_btc") : errors.btcAddress.message}
                </div>
            )}
            {premiumRedeemVaults.size > 0 && (
                <div className="row">
                    <div className="col-12">
                        <div className="wizard-item mt-5">
                            <div className="row">
                                <div className="col-10 text-left">{t("redeem_page.premium_redeem")}</div>
                                <div className="col-2">
                                    <input type="checkbox" id="premiumRedeem" onChange={togglePremium}></input>
                                </div>
                            </div>
                            {premiumRedeem && (
                                <div className="row">
                                    <div className="col-2"></div>
                                    <div className="col-10 text-right font-weight-light">
                                        {t("redeem_page.max_premium_redeem")}: {maxPremiumRedeem.toString()} PolkaBTC
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div className="wizard-item mt-5">
                        <div className="row">
                            <div className="col-6 text-left">{t("bridge_fee")}</div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                {redeemFee} BTC
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-12">
                    <div className="wizard-item">
                        <div className="row">
                            <div className="col-6 text-left">
                                {t("bitcoin_network_fee")}
                            </div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>BTC
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="row">
                <div className="col-12">
                    <div className="wizard-item">
                        <div className="row">
                            <div className="col-6 text-left font-weight-bold">{t("you_will_receive")}</div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                {calculateTotalBTC()} BTC
                            </div>
                        </div>
                        {premiumRedeem && (
                            <div className="row">
                                <div className="col-6 text-left">{t("redeem_page.earned_premium")}</div>
                                <div className="col-6">
                                    <img src={PolkadotLogo} width="23px" height="23px" alt="polkadot logo"></img>
                                    {calculateTotalDOT()} DOT
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ButtonMaybePending
                type="submit"
                className="btn btn-primary app-btn"
                isPending={isRequestPending}
                onClick={checkAddress}
            >
                {t("confirm")}
            </ButtonMaybePending>
        </form>
    );
}
