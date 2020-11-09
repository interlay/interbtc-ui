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
import { satToBTC, planckToDOT, getP2WPKHFromH160 } from "@interlay/polkabtc";
import {
    updateBTCAddressAction,
    updateCollateralizationAction,
    updateCollateralAction,
    updateLockedBTCAction,
} from "../../common/actions/vault.actions";
import "./vault-dashboard.page.scss";
import * as constants from "../../constants";

export default function VaultDashboardPage() {
    const [showRegisterVaultModal, setShowRegisterVaultModal] = useState(false);
    const [showUpdateCollateralModal, setShowUpdateCollateralModal] = useState(false);
    const [showUpdateBTCAddressModal, setShowUpdateBTCAddressModal] = useState(false);
    const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const vaultClientLoaded = useSelector((state: StoreType) => state.general.vaultClientLoaded);
    const btcAddress = useSelector((state: StoreType) => state.vault.btcAddress);
    const collateralization = useSelector((state: StoreType) => state.vault.collateralization);
    const collateral = useSelector((state: StoreType) => state.vault.collateral);
    const lockedBTC = useSelector((state: StoreType) => state.vault.lockedBTC);
    const [feesEarned] = useState("0");
    const [vaultId, setVaultId] = useState("0");
    const [accountId, setAccountId] = useState("0");
    const dispatch = useDispatch();

    const closeRegisterVaultModal = () => setShowRegisterVaultModal(false);
    const closeUpdateCollateralModal = () => setShowUpdateCollateralModal(false);
    const closeUpdateBTCAddressModal = () => setShowUpdateBTCAddressModal(false);
    const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || !vaultClientLoaded) return;

            const accountId = await window.vaultClient.getAccountId();
            setAccountId(accountId);

            const vaultId = window.polkaBTC.api.createType("AccountId", accountId);
            const vault = await window.polkaBTC.vaults.get(vaultId);
            setVaultId(vault.id.toString());

            const vaultBTCAddress = getP2WPKHFromH160(vault.wallet.address);
            if (vaultBTCAddress === undefined) {
                throw new Error("Vault has invalid BTC address.");
            }
            dispatch(updateBTCAddressAction(vaultBTCAddress));

            const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
            const collateralDot = planckToDOT(balanceLockedDOT.toString());
            dispatch(updateCollateralAction(collateralDot));

            const totalPolkaSAT = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId);
            const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
            dispatch(updateLockedBTCAction(lockedAmountBTC));

            const collateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId);
            dispatch(updateCollateralizationAction(collateralization));
        };
        fetchData();
    }, [polkaBtcLoaded, vaultClientLoaded, dispatch]);

    return (
        <div className="vault-dashboard-page container-fluid white-background">
            <div className="vault-container">
                <div className="stacked-wrapper">
                    <div className="row">
                        <div className="title">Vault Dashboard</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats">Locked: {collateral} DOT</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats">Locked: {lockedBTC} BTC</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats">Fees earned: {feesEarned}</div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats btc-address-header">
                            BTC Address: &nbsp;&nbsp;
                            <a
                                href={
                                    (constants.BTC_MAINNET
                                        ? constants.BTC_EXPLORER_ADDRESS_API
                                        : constants.BTC_TEST_EXPLORER_ADDRESS_API) + btcAddress
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {btcAddress}
                            </a>
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-edit" onClick={() => setShowUpdateBTCAddressModal(true)}></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats">
                            Collateral: &nbsp; {collateral} DOT for {lockedBTC + " BTC"}
                            &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-edit" onClick={() => setShowUpdateCollateralModal(true)}></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="stats">
                            Collateralization: &nbsp;
                            {collateralization === undefined ? "∞" : (collateralization * 100).toFixed(3)}%
                        </div>
                    </div>
                </div>
                {(vaultId !== accountId) && (
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
