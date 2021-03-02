import React, { useState, useEffect, ReactElement } from "react";
import RegisterVaultModal from "./register-vault/register-vault";
import UpdateCollateralModal from "./update-collateral/update-collateral";
import RequestReplacementModal from "./request-replacement/request-replacement";
import { Button } from "react-bootstrap";
import { StoreType } from "../../common/types/util.types";
import { useSelector, useDispatch } from "react-redux";
import IssueTable from "./issue-table/issue-table";
import RedeemTable from "./redeem-table/redeem-table";
import ReplaceTable from "./replace-table/replace-table";
import { satToBTC, planckToDOT } from "@interlay/polkabtc";
import {
    updateBTCAddressAction,
    updateCollateralizationAction,
    updateCollateralAction,
    updateLockedBTCAction,
    updateSLAAction,
    updateAPYAction,
} from "../../common/actions/vault.actions";
import "./vault-dashboard.page.scss";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { safeRoundTwoDecimals } from "../../common/utils/utils";
import TimerIncrement from "../../common/components/timer-increment";

export default function VaultDashboardPage(): ReactElement {
    const [showRegisterVaultModal, setShowRegisterVaultModal] = useState(false);
    const [showUpdateCollateralModal, setShowUpdateCollateralModal] = useState(false);
    const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
    const { vaultClientLoaded, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const { collateralization, collateral, lockedBTC, sla, apy } = useSelector((state: StoreType) => state.vault);
    const [capacity, setCapacity] = useState("0");
    const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState("0");
    const [feesEarnedDOT, setFeesEarnedDOT] = useState("0");
    const [vaultId, setVaultId] = useState("0");
    const [accountId, setAccountId] = useState("0");
    const [vaultRegistered, setVaultRegistered] = useState(false);
    const vaultNotRegisteredToastId = "vault-not-registered-id";

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const closeRegisterVaultModal = () => setShowRegisterVaultModal(false);
    const closeUpdateCollateralModal = () => setShowUpdateCollateralModal(false);
    const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || !vaultClientLoaded) return;

            try {
                const accountId = await window.vaultClient.getAccountId();
                setAccountId(accountId);

                const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
                const vault = await window.polkaBTC.vaults.get(vaultId);
                setVaultId(vault.id.toString());

                // show warning if vault is not registered with the parachain
                if (accountId !== vault.id.toString()) {
                    toast.warn(
                        "Local vault client running, but vault is not yet registered with the parachain." +
                            " Client needs to be registered and DOT locked to start backing PolkaBTC and earning fees.",
                        { autoClose: false, toastId: vaultNotRegisteredToastId }
                    );
                }

                let vaultBTCAddress = vault.wallet.btcAddress;
                vaultBTCAddress = vaultBTCAddress ? vaultBTCAddress : "";
                dispatch(updateBTCAddressAction(vaultBTCAddress));

                const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
                const collateralDot = planckToDOT(balanceLockedDOT.toString());
                dispatch(updateCollateralAction(collateralDot));

                const feesPolkaSAT = await window.polkaBTC.vaults.getFeesPolkaBTC(vaultId.toString());
                setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT));

                const feesPlanck = await window.polkaBTC.vaults.getFeesDOT(vaultId.toString());
                setFeesEarnedDOT(planckToDOT(feesPlanck));

                const totalPolkaSAT = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId);
                const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
                dispatch(updateLockedBTCAction(lockedAmountBTC));

                const collateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId);
                dispatch(updateCollateralizationAction(collateralization?.mul(100).toString()));

                const slaScore = await window.polkaBTC.vaults.getSLA(vaultId.toString());
                dispatch(updateSLAAction(slaScore));

                const apyScore = await window.polkaBTC.vaults.getAPY(vaultId.toString());
                dispatch(updateAPYAction(apyScore));

                const issuablePolkaBTC = await window.polkaBTC.vaults.getIssuablePolkaBTC();
                setCapacity(issuablePolkaBTC);
            } catch (err) {
                toast.error(err);
            }
        };
        fetchData();
    }, [polkaBtcLoaded, vaultClientLoaded, dispatch, vaultRegistered]);

    return (
        <div className="vault-dashboard-page main-container">
            <div className="vault-container dashboard-fade-in-animation dashboard-min-height">
                <div className="stacked-wrapper">
                    <div className="title-text-container">
                        <h1 className="title-text">{t("vault.vault_dashboard")}</h1>
                        <p className="latest-block-text">
                            <TimerIncrement></TimerIncrement>
                        </p>
                    </div>
                </div>
                {vaultId === accountId && (
                    <React.Fragment>
                        <div className="col-lg-10 offset-1">
                            <div className="row mt-3">
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">{t("vault.locked_collateral")}</div>
                                    <span className="stats">{collateral}</span> DOT
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">{t("locked_btc")}</div>
                                    <span className="stats">{lockedBTC}</span> BTC
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">{t("collateralization")}</div>
                                    <span className="stats">
                                        {`${safeRoundTwoDecimals(collateralization?.toString(), "∞")}%`}
                                    </span>
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">{t("vault.capacity")}</div>
                                    <span className="stats">~{safeRoundTwoDecimals(capacity)}</span> PolkaBTC
                                </div>
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-3">
                                    <div className="">{t("fees_earned")}</div>
                                    <span className="stats">{feesEarnedPolkaBTC.toString()}</span> PolkaBTC
                                </div>
                                <div className="col-md-3">
                                    <div className="">{t("fees_earned")}</div>
                                    <span className="stats">{feesEarnedDOT.toString()}</span> DOT
                                </div>
                                <div className="col-md-3">
                                    <div className="">{t("sla_score")}</div>
                                    <span className="stats">{safeRoundTwoDecimals(sla)}</span>
                                </div>
                                <div className="col-md-3">
                                    <div className="">{t("apy")}</div>
                                    <span className="stats">~{safeRoundTwoDecimals(apy)}</span> %
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="">
                                    {t("vault.collateral")}: &nbsp; {collateral} DOT for {lockedBTC + " BTC"}
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="fa fa-edit" onClick={() => setShowUpdateCollateralModal(true)}></i>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {vaultId !== accountId && (
                    <Button
                        variant="outline-success"
                        className="register-vault-dashboard"
                        onClick={() => setShowRegisterVaultModal(true)}
                    >
                        {t("register")}
                    </Button>
                )}
                <IssueTable></IssueTable>
                <RedeemTable></RedeemTable>
                <ReplaceTable openModal={setShowRequestReplacementModal}></ReplaceTable>
                <RegisterVaultModal
                    onClose={closeRegisterVaultModal}
                    onRegister={() => setVaultRegistered(true)}
                    show={showRegisterVaultModal}
                ></RegisterVaultModal>
                <UpdateCollateralModal
                    onClose={closeUpdateCollateralModal}
                    show={showUpdateCollateralModal}
                ></UpdateCollateralModal>
                <RequestReplacementModal
                    onClose={closeRequestReplacementModal}
                    show={showRequestReplacementModal}
                ></RequestReplacementModal>
            </div>
        </div>
    );
}
