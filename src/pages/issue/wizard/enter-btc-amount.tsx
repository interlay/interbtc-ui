import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import {
    changeAmountBTCAction,
    changeIssueStepAction,
    changeVaultBtcAddressOnIssueAction,
    changeVaultDotAddressOnIssueAction,
    updateIssueFeeAction,
    updateIssueGriefingCollateralAction,
} from "../../../common/actions/issue.actions";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat, stripHexPrefix, satToBTC, planckToDOT } from "@interlay/polkabtc";
import { BALANCE_MAX_INTEGER_LENGTH } from "../../../constants";
import { useTranslation } from "react-i18next";

type EnterBTCForm = {
    amountBTC: string;
};

export default function EnterBTCAmount() {
    const { t } = useTranslation();
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const amount = useSelector((state: StoreType) => state.issue.amountBTC);
    const defaultValues = amount ? { defaultValues: { amountBTC: amount } } : undefined;
    const { register, handleSubmit, errors } = useForm<EnterBTCForm>(defaultValues);
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

    const onSubmit = handleSubmit(async ({ amountBTC }) => {
        if (!polkaBtcLoaded) return;
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
            toast.success("Found vault: " + vaultId.toString());
            // get the vault's data
            const vault = await window.polkaBTC.vaults.get(vaultId);
            const vaultBTCAddress = vault.wallet.address;

            const fee = await window.polkaBTC.issue.getFeesToPay(amountBTC);
            dispatch(updateIssueFeeAction(fee));

            const griefingCollateral = await window.polkaBTC.issue.getGriefingCollateralInPlanck(amountSAT);
            dispatch(updateIssueGriefingCollateralAction(planckToDOT(griefingCollateral)));

            dispatch(changeVaultBtcAddressOnIssueAction(stripHexPrefix(vaultBTCAddress)));
            dispatch(changeVaultDotAddressOnIssueAction(vaultId.toString()));
            dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    });

    return (
        <form onSubmit={onSubmit}>
            <Modal.Body>
                <p>
                    {t("issue_page.enter-polkabtc-amount-desc-1")}
                    <br />
                    {t("issue_page.enter-polkabtc-amount-desc-2")}
                    <br />
                    <br />
                    {t("issue_page.enter-polkabtc-amount-desc-3")} ({dustValue} BTC).
                </p>
                <div className="row">
                    <div className="col-12 basic-addon">
                        <div className="input-group">
                            <input
                                name="amountBTC"
                                type="float"
                                className={"form-control custom-input" + (errors.amountBTC ? " error-borders" : "")}
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
                            <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2">
                                    PolkaBTC
                                </span>
                            </div>
                        </div>
                        {errors.amountBTC && (
                            <div className="input-error">
                                {errors.amountBTC.type === "required"
                                    ? t("issue_page.enter_valid_amount")
                                    : errors.amountBTC.message}
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
