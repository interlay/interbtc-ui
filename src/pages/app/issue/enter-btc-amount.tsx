import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import BitcoinLogo from "../../../assets/img/Bitcoin-Logo.png";
import PolkadotLogo from "../../../assets/img/polkadot-logo.png";
import * as constants from "../../../constants";
import Big from "big.js";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";

import {
    changeAmountBTCAction,
    changeIssueStepAction,
    changeVaultDotAddressOnIssueAction,
    updateIssueGriefingCollateralAction,
    changeVaultBtcAddressOnIssueAction,
    changeIssueIdAction,
} from "../../../common/actions/issue.actions";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC, planckToDOT, stripHexPrefix } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";
import { useTranslation } from "react-i18next";
import { calculateAmount } from "../../../common/utils/utils";

type EnterBTCForm = {
    amountBTC: string;
};

export default function EnterBTCAmount() {
    const { polkaBtcLoaded, address, bitcoinHeight, btcRelayHeight, prices } = useSelector(
        (state: StoreType) => state.general
    );
    const amount = useSelector((state: StoreType) => state.issue.amountBTC);
    const { vaultDotAddress } = useSelector((state: StoreType) => state.issue);
    const defaultValues = amount ? { defaultValues: { amountBTC: amount } } : undefined;
    const { register, handleSubmit, errors, getValues } = useForm<EnterBTCForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [dustValue, setDustValue] = useState("0");
    const [usdAmount, setUsdAmount] = useState("");
    const [fee, setFee] = useState("0");
    const [deposit, setDeposit] = useState("0");
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const dustValueAsSatoshi = await window.polkaBTC.redeem.getDustValue();
                const dustValueBtc = satToBTC(dustValueAsSatoshi.toString());
                setDustValue(dustValueBtc);
            } catch (error) {
                console.log(error);
            }
        };
        setUsdAmount(calculateAmount(amount || getValues("amountBTC") || "0", prices.bitcoin.usd));
        fetchData();
    }, [polkaBtcLoaded, setUsdAmount, amount, prices.bitcoin.usd, getValues]);

    const onSubmit = handleSubmit(async ({ amountBTC }) => {
        if (!polkaBtcLoaded) return;
        if (!address) {
            toast.warning(t("issue_page.must_select_account_warning"));
            return;
        }
        if (bitcoinHeight - btcRelayHeight > constants.BLOCKS_BEHIND_LIMIT) {
            toast.error(t("issue_page.error_more_than_6_blocks_behind"));
            return;
        }
        setRequestPending(true);
        try {
            const amountSAT = btcToSat(amountBTC);
            if (amountSAT === undefined) {
                throw new Error("Invalid BTC amount input.");
            }
            const amountBTCInteger = amountBTC.split(".")[0];
            if (amountBTCInteger.length > BALANCE_MAX_INTEGER_LENGTH) {
                throw new Error("Input value is too high");
            }
            dispatch(changeAmountBTCAction(amountBTC));

            const amountAsSatoshi = window.polkaBTC.api.createType("Balance", amountSAT);

            const vaultId = await window.polkaBTC.vaults.selectRandomVaultIssue(amountAsSatoshi);

            const griefingCollateral = await window.polkaBTC.issue.getGriefingCollateralInPlanck(amountSAT);
            dispatch(updateIssueGriefingCollateralAction(planckToDOT(griefingCollateral)));

            dispatch(changeVaultDotAddressOnIssueAction(vaultId.toString()));

            // const amount = window.polkaBTC.api.createType("Balance", amountSAT) as PolkaBTC;
            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultDotAddress);
            const requestResult = await window.polkaBTC.issue.request(amountAsSatoshi as PolkaBTC, vaultAccountId);

            const vaultBTCAddress = requestResult.vault.wallet.btcAddress;
            if (vaultBTCAddress === undefined) {
                throw new Error("Could not generate unique vault address.");
            }
            dispatch(changeVaultBtcAddressOnIssueAction(stripHexPrefix(vaultBTCAddress)));
            // get the issue id from the request issue event
            const id = stripHexPrefix(requestResult.id.toString());

            // update the issue status
            dispatch(changeIssueIdAction(id));
            dispatch(changeIssueStepAction("BTC_PAYMENT"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    const onValueChange = async () => {
        const value = getValues("amountBTC");
        setUsdAmount(calculateAmount(value || "0", prices.bitcoin.usd));
        try {
            const fee = await window.polkaBTC.issue.getFeesToPay(value);
            setFee(fee);

            const amountSAT = btcToSat(value);
            const amountAsSatoshi = window.polkaBTC.api.createType("Balance", amountSAT);
            const vaultId = await window.polkaBTC.vaults.selectRandomVaultIssue(amountAsSatoshi);
            const griefingCollateral = await window.polkaBTC.issue.getGriefingCollateralInPlanck(amountSAT);
            setDeposit(griefingCollateral);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-12 wizard-header-text">{t("issue_page.mint_polka_by_wrapping")}</div>
            </div>
            <div className="row">
                <div className="col-6">
                    <input
                        id="amount-btc-input"
                        name="amountBTC"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        className={"" + (errors.amountBTC ? " error-borders" : "")}
                        onChange={onValueChange}
                        ref={register({
                            required: true,
                            validate: (value) => {
                                const message =
                                    value > 1
                                        ? t("issue_page.validation_max_value")
                                        : value < Number(dustValue)
                                        ? t("issue_page.validation_min_value") + dustValue + "BTC)."
                                        : undefined;
                                return message;
                            },
                        })}
                    />
                </div>
                <div className="col-6 mark-currency">PolkaBTC</div>
            </div>
            <div className="row usd-price">
                <div className="col">{"~ $" + usdAmount}</div>
            </div>
            {errors.amountBTC && (
                <div className="wizard-input-error">
                    {errors.amountBTC.type === "required"
                        ? t("issue_page.enter_valid_amount")
                        : errors.amountBTC.message}
                </div>
            )}
            <div className="row">
                <div className="col bridge-fee">{t("bridge_fee")}</div>
            </div>
            <div className="row">
                <div className="col fee-number">
                    <div>
                        <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                        <span className="fee-btc">{fee}</span> BTC
                    </div>
                    <div>{"~ $" + Number(fee) * prices.bitcoin.usd}</div>
                </div>
            </div>
            <div className="row">
                <div className="col bridge-fee mt-3">{t("issue_page.security_deposit")}</div>
            </div>
            <div className="row">
                <div className="col fee-number">
                    <div>
                        <img src={PolkadotLogo} width="20px" height="20px" alt="polkadot logo"></img> &nbsp;
                        <span className="fee-btc">{fee}</span> DOT
                    </div>
                    <div>{"~ $" + new Big(deposit).mul(new Big(prices.polkadot.usd)).toString()}</div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-8 horizontal-line-total"></div>
            </div>

            <div className="row justify-content-center mb-3">
                <div className="col-4 text-left bold">{t("total_deposit")}</div>
                <div className="col-4 text-right">
                    <div>
                        <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                        <span className="fee-btc">{fee}</span> BTC
                    </div>
                    <div>{"~ $" + Number(fee) * prices.bitcoin.usd}</div>
                </div>
            </div>

            <ButtonMaybePending className="btn green-button app-btn" isPending={isRequestPending} onClick={onSubmit}>
                {t("confirm")}
            </ButtonMaybePending>
        </form>
    );
}
