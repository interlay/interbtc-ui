import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import BitcoinLogo from "../../../assets/img/Bitcoin-Logo.png";

import {
    changeAmountBTCAction,
    changeIssueStepAction,
    changeVaultDotAddressOnIssueAction,
    updateIssueFeeAction,
    updateIssueGriefingCollateralAction,
} from "../../../common/actions/issue.actions";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, satToBTC, planckToDOT } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";
import { useTranslation } from "react-i18next";
import { calculateAmount } from "../../../common/utils/utils";

type EnterBTCForm = {
    amountBTC: string;
};

export default function EnterBTCAmount() {
    const usdPrice = useSelector((state: StoreType) => state.general.prices.bitcoin.usd);
    const { polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
    const amount = useSelector((state: StoreType) => state.issue.amountBTC);
    const defaultValues = amount ? { defaultValues: { amountBTC: amount } } : undefined;
    const { register, handleSubmit, errors, getValues } = useForm<EnterBTCForm>(defaultValues);
    const [isRequestPending, setRequestPending] = useState(false);
    const [dustValue, setDustValue] = useState("0");
    const [usdAmount, setUsdAmount] = useState("");
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
        setUsdAmount(calculateAmount(amount || getValues("amountBTC") || "0", usdPrice));
        fetchData();
    }, [polkaBtcLoaded, setUsdAmount, amount, usdPrice, getValues]);

    const onSubmit = handleSubmit(async ({ amountBTC }) => {
        if (!polkaBtcLoaded) return;
        if (!address) {
            toast.warning(t("issue_page.must_select_account_warning"));
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

            const fee = await window.polkaBTC.issue.getFeesToPay(amountBTC);
            dispatch(updateIssueFeeAction(fee));

            const griefingCollateral = await window.polkaBTC.issue.getGriefingCollateralInPlanck(amountSAT);
            dispatch(updateIssueGriefingCollateralAction(planckToDOT(griefingCollateral)));

            dispatch(changeVaultDotAddressOnIssueAction(vaultId.toString()));
            dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <form onSubmit={onSubmit}>
            <div className="row">
                <div className="col-6">
                    <input
                        id="amount-btc-input"
                        name="amountBTC"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        className={"" + (errors.amountBTC ? " error-borders" : "")}
                        onChange={() => {
                            setUsdAmount(calculateAmount(getValues("amountBTC") || "0", usdPrice));
                        }}
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
                <div className="col">{"= $" + usdAmount}</div>
            </div>
            {errors.amountBTC && (
                <div className="wizard-input-error">
                    {errors.amountBTC.type === "required"
                        ? t("issue_page.enter_valid_amount")
                        : errors.amountBTC.message}
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div className="locking-by">
                        <div className="row">
                            <div className="col-6">{t("issue_page.by_locking")}</div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>BTC
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ButtonMaybePending className="btn btn-primary app-btn" isPending={isRequestPending} onClick={onSubmit}>
                {t("next")}
            </ButtonMaybePending>
        </form>
    );
}
