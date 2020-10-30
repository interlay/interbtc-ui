import React, { useState, useEffect } from "react";
import RegisterVaultModal from "./register-vault/register-vault";
import UpdateCollateralModal from "./update-collateral/update-collateral";
import UpdateBTCAddressModal from "./update-btc-address/update-btc-address";
import RequestReplacementModal from "./request-replacement/request-replacement";
import { Button } from "react-bootstrap";
import { StoreType } from "../../common/types/util.types";
import { useSelector } from "react-redux";
import IssueTable from "./issue-table/issue-table";
import RedeemTable from "./redeem-table/redeem-table";
import ReplaceTable from "./replace-table/replace-table";

import "./vault-dashboard.page.scss";

export default function VaultDashboardPage(){
    const [showRegisterVaultModal, setShowRegisterVaultModal] = useState(false);
    const [showUpdateCollateralModal, setShowUpdateCollateralModal] = useState(false);
    const [showUpdateBTCAddressModal, setShowUpdateBTCAddressModal] = useState(false);
    const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const btcAddress = useSelector((state: StoreType) => state.general.btcAddress);
    const collateral = useSelector((state: StoreType) => state.general.collateral);
    const [dotLocked, setDotLocked] = useState("0");
    const [btcLocked, setBtcLocked] = useState("0");
    const [feesEarned, setFeesEarned] = useState("0");
    const [collateralization, setCollateralization] = useState(0);


    const closeRegisterVaultModal = () => setShowRegisterVaultModal(false);
    const closeUpdateCollateralModal = () => setShowUpdateCollateralModal(false);
    const closeUpdateBTCAddressModal = () => setShowUpdateBTCAddressModal(false);
    const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded) return;

            // const address = await window.polkaBTC.vaults.getAddress();
            // const accountId = window.polkaBTC.api.createType("AccountId", address);

            // const lockedPlanck = (await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(accountId)).toString();
            // setDotLocked(planckToDOT(lockedPlanck));

            // // TO DO GET BTC LOCKED AND SET
            // setBtcLocked("0");

            // const fees = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(accountId);
            // setFeesEarned(fees.toString());

            // const collateralization = await window.polkaBTC.vaults.getCollateralization(accountId);
            // setCollateralization(collateralization);
            const totalBTC = await window.polkaBTC.vaults.getTotalIssuedPolkaBTCAmount();
            setBtcLocked(totalBTC.toString());
        };
        fetchData();
    },[polkaBtcLoaded]);

    return <div className="vault-dashboard-page container-fluid white-background">
        <div className="vault-container">
            <div className="stacked-wrapper">
                <div className="row">
                    <div className="title">Vault Dashboard</div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="stats">Dot locked: {dotLocked} DOT</div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="stats">BTC locked: {btcLocked}</div>
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
                        BTC Address: {btcAddress} 
                        &nbsp;<i className="fa fa-edit" onClick={() => setShowUpdateBTCAddressModal(true)}></i>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="stats">
                        Collateral: &nbsp;&nbsp;{collateral} DOT  for  {"2 BTC"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                        900% Collateralization
                        &nbsp;<i className="fa fa-edit" onClick={() => setShowUpdateCollateralModal(true)}></i>
                    </div>
                </div>
            </div>
            <Button
                variant="outline-success"
                className="register-vault-dashboard"
                onClick={() => setShowRegisterVaultModal(true)}
            >
                Register
            </Button>
            <IssueTable></IssueTable>
            <RedeemTable></RedeemTable>
            <ReplaceTable openModal={setShowRequestReplacementModal}></ReplaceTable>
            <RegisterVaultModal onClose={closeRegisterVaultModal} show={showRegisterVaultModal}></RegisterVaultModal>
            <UpdateCollateralModal onClose={closeUpdateCollateralModal} show={showUpdateCollateralModal}></UpdateCollateralModal>
            <UpdateBTCAddressModal onClose={closeUpdateBTCAddressModal} show={showUpdateBTCAddressModal}></UpdateBTCAddressModal>
            <RequestReplacementModal onClose={closeRequestReplacementModal} show={showRequestReplacementModal}></RequestReplacementModal>
        </div>    
    </div>
}