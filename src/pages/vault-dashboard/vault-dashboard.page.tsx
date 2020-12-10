import React, { useState, useEffect } from "react";
import RegisterVaultModal from "./register-vault/register-vault";
import UpdateCollateralModal from "./update-collateral/update-collateral";
import UpdateBTCAddressModal from "./update-btc-address/update-btc-address";
import RequestReplacementModal from "./request-replacement/request-replacement";
import { Button } from "react-bootstrap";
import { StoreType } from "../../common/types/util.types";
import { useSelector, useDispatch } from "react-redux";
import IssueTable from "./issue-table/issue-table";
import RedeemTable from "./redeem-table/redeem-table";
import ReplaceTable from "./replace-table/replace-table";
import { satToBTC, planckToDOT, roundTwoDecimals } from "@interlay/polkabtc";
import {
    updateBTCAddressAction,
    updateCollateralizationAction,
    updateCollateralAction,
    updateLockedBTCAction,
    updateSLAAction
} from "../../common/actions/vault.actions";
import "./vault-dashboard.page.scss";
import { encodeBitcoinAddress } from "../../common/utils/utils";
import { toast } from "react-toastify";
import BitcoinAddress from "../../common/components/bitcoin-links/address";

export default function VaultDashboardPage() {
    const [showRegisterVaultModal, setShowRegisterVaultModal] = useState(false);
    const [showUpdateCollateralModal, setShowUpdateCollateralModal] = useState(false);
    const [showUpdateBTCAddressModal, setShowUpdateBTCAddressModal] = useState(false);
    const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
    const { vaultClientLoaded, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const {btcAddress, collateralization, collateral, lockedBTC, sla} = useSelector((state: StoreType) => state.vault);
    const [capacity, setCapacity] = useState("0");
    const [feesEarned] = useState("0");
    const [vaultId, setVaultId] = useState("0");
    const [accountId, setAccountId] = useState("0");
    const [vaultRegistered, setVaultRegistered] = useState(false);
    const vaultNotRegisteredToastId = "vault-not-registered-id";

    const dispatch = useDispatch();

    const closeRegisterVaultModal = () => setShowRegisterVaultModal(false);
    const closeUpdateCollateralModal = () => setShowUpdateCollateralModal(false);
    const closeUpdateBTCAddressModal = () => setShowUpdateBTCAddressModal(false);
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

                const vaultBTCAddress = encodeBitcoinAddress(vault.wallet.address);
                dispatch(updateBTCAddressAction(vaultBTCAddress));

                const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
                const collateralDot = planckToDOT(balanceLockedDOT.toString());
                dispatch(updateCollateralAction(collateralDot));

                const totalPolkaSAT = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId);
                const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
                dispatch(updateLockedBTCAction(lockedAmountBTC));

                const collateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId);
                dispatch(updateCollateralizationAction(collateralization));

                // FILIP: ADD CALL TO FETCH VAULT SLA
                dispatch(updateSLAAction(10));

                const issuablePolkaBTC = await window.polkaBTC.vaults.getIssuablePolkaBTC();
                setCapacity(issuablePolkaBTC);
            } catch (err) {
                console.log(err);
                toast.warn(
                    "Local vault client running, but vault is not yet registered with the parachain." +
                        " Client needs to be registered and DOT locked to start backing PolkaBTC and earning fees.",
                    { autoClose: false, toastId: vaultNotRegisteredToastId }
                );
            }
        };
        fetchData();
    }, [polkaBtcLoaded, vaultClientLoaded, dispatch, vaultRegistered]);

    return (
        <div className="vault-dashboard-page container-fluid white-background">
            <div className="vault-container dashboard-fade-in-animation dashboard-min-height">
                <div className="stacked-wrapper">
                    <div className="row">
                        <div className="title">Vault Dashboard</div>
                    </div>
                </div>
                {vaultId === accountId && (
                    <React.Fragment>
                        <div className="col-lg-10 offset-1">
                            <div className="row mt-3">
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">Locked collateral</div>
                                    <span className="stats">{collateral}</span> DOT
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">Locked BTC</div>
                                    <span className="stats">{lockedBTC}</span> BTC
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">Collateralization</div>
                                    <span className="stats">
                                        {collateralization === undefined || isNaN(collateralization)
                                            ? "∞"
                                            : `${roundTwoDecimals((collateralization * 100).toString())}%`}
                                    </span>
                                </div>
                                <div className="col-lg-3 col-md-6 col-6">
                                    <div className="">Capacity</div>
                                    <span className="stats">~{roundTwoDecimals(capacity)}</span> PolkaBTC
                                </div>
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-3">
                                    <div className="">Earned fees</div>
                                    <span className="stats">{feesEarned}</span> PolkaBTC
                                </div>
                                <div className="col-md-3">
                                    <div className="">SLA score</div>
                                    <span className="stats">{sla}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="btc-address-header">
                                    BTC Address: &nbsp;&nbsp;
                                    <BitcoinAddress btcAddress={btcAddress} />
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="fa fa-edit" onClick={() => setShowUpdateBTCAddressModal(true)}></i>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="">
                                    Collateral: &nbsp; {collateral} DOT for {lockedBTC + " BTC"}
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
                        Register
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
                <UpdateBTCAddressModal
                    onClose={closeUpdateBTCAddressModal}
                    show={showUpdateBTCAddressModal}
                ></UpdateBTCAddressModal>
                <RequestReplacementModal
                    onClose={closeRequestReplacementModal}
                    show={showRequestReplacementModal}
                ></RequestReplacementModal>
            </div>
        </div>
    );
}
