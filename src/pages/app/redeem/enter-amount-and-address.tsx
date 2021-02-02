import React, { useState, useEffect } from "react";
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
    addRedeemRequestAction
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { StoreType } from "../../../common/types/util.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC, stripHexPrefix } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH, BTC_ADDRESS_REGEX } from "../../../constants";
import { useTranslation } from "react-i18next";
import BitcoinLogo from "../../../assets/img/Bitcoin-Logo.png";
import Big from "big.js";
import { RedeemRequest } from "../../../common/types/redeem.types";
import { startTransactionWatcherRedeem } from "../../../common/utils/redeem-transaction.watcher";
import { updateBalancePolkaBTCAction } from "../../../common/actions/general.actions";
import { calculateAmount } from "../../../common/utils/utils";


type AmountAndAddressForm = {
    amountPolkaBTC: string;
    btcAddress: string;
};

export default function EnterAmountAndAddress() {
    const { t } = useTranslation();
    const { balancePolkaBTC, polkaBtcLoaded, prices } = useSelector((state: StoreType) => state.general);
    const amount = useSelector((state: StoreType) => state.redeem.amountPolkaBTC);
    const defaultValues = amount ? { defaultValues: { amountPolkaBTC: amount, btcAddress: "" } } : undefined;
    const { register, handleSubmit, errors, getValues } = useForm<AmountAndAddressForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [dustValue, setDustValue] = useState("0");
    const dispatch = useDispatch();
    const [usdAmount, setUsdAmount] = useState(calculateAmount(amount || "0",prices.bitcoin.usd.toString()));
    const [redeemFee, setRedeemFee] = useState("0");

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
            const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
            setDustValue(dustValueBtc);
        };
        fetchData();
    }, [polkaBtcLoaded, getValues]);

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

            let vaultId;
            let vaultBTCAddress;
            
            vaultId = await window.polkaBTC.vaults.selectRandomVaultRedeem(amountAsSatoshi);
            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            vaultBTCAddress = vault.wallet.addresses[0];
        
            // toast.success("Found vault: " + vaultId.toString());

            const fee = await window.polkaBTC.redeem.getFeesToPay(amountPolkaBTC);
            dispatch(updateRedeemFeeAction(fee));

            dispatch(changeVaultBtcAddressOnRedeemAction(vaultBTCAddress));
            dispatch(changeVaultDotAddressOnRedeemAction(vaultId.toString()));
            dispatch(changeBTCAddressAction(btcAddress));


            const amount = window.polkaBTC.api.createType("Balance", amountPolkaSAT);
            const totalAmountBTC = ((new Big(amountPolkaBTC)).sub(new Big(fee))).toString();

            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultId.toString());
            const requestResult = await window.polkaBTC.redeem.request(amount, btcAddress, vaultAccountId);

            // get the redeem id from the request redeem event
            const id = stripHexPrefix(requestResult.id.toString());
            const redeemRequest = await window.polkaBTC.redeem.getRequestById(id);

            // update the redeem status
            dispatch(changeRedeemIdAction(id));

            const request: RedeemRequest = {
                id,
                amountPolkaBTC,
                creation: redeemRequest.opentime.toString(),
                fee: fee,
                totalAmount: totalAmountBTC,
                btcAddress,
                btcTxId: "",
                confirmations: 0,
                completed: false,
                isExpired: false,
                cancelled: false,
                reimbursed: false
            };
            dispatch(addRedeemRequestAction(request));
            startTransactionWatcherRedeem(request,dispatch);
            dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC)).toString()));
            dispatch(changeRedeemStepAction("REDEEM_INFO"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    const calculateTotal = (): string => {
        const amount = getValues("amountPolkaBTC") || "0";
        if (amount === "0") return "0";
        return new Big(amount).sub(new Big(redeemFee)).toString();
    }

    const onAmountChange = async () => {
        const amount = getValues("amountPolkaBTC") || "0";
        setUsdAmount(calculateAmount(amount,prices.bitcoin.usd.toString()));
        const fee = await window.polkaBTC.redeem.getFeesToPay(amount);
        setRedeemFee(fee);
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-6">
                    <input
                        id="amount-btc-input"
                        name="amountPolkaBTC"
                        type="float"
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
                <div className="col-6 mark-currency">
                    PolkaBTC
                </div>
            </div>
            <div className="row usd-price">
                <div className="col">
                    {"= $" + usdAmount}
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
                            {t("destination")}
                        </div>
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
                    {errors.btcAddress.type === "required"
                        ? t("redeem_page.enter_btc")
                        : errors.btcAddress.message}
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div className="wizard-item mt-5">
                        <div className="row">
                            <div className="col-6 text-left">
                                {t("bridge_fee")}
                            </div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>{redeemFee} BTC
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
                            <div className="col-6 text-left font-weight-bold">
                                {t("you_will_receive")}
                            </div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                {calculateTotal()} BTC
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ButtonMaybePending
                className="btn btn-primary app-btn"
                isPending={isRequestPending}
                onClick={onSubmit}
            >
                {t("confirm")}
            </ButtonMaybePending>
        </form>
    );
}
