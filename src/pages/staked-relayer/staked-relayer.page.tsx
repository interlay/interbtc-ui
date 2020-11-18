import React, { useState, useEffect } from "react";
import BitcoinTable from "../../common/components/bitcoin-table/bitcoin-table";
import ReportModal from "./report-modal/report-modal";
import RegisterModal from "./register-modal/register-modal";
import { Button } from "react-bootstrap";
import StatusUpdateTable from "../../common/components/status-update-table/status-update-table";
import VaultTable from "../../common/components/vault-table/vault-table";
import OracleTable from "../../common/components/oracle-table/oracle-table";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import "./staked-relayer.page.scss";
import { StoreType } from "../../common/types/util.types";
import ButtonMaybePending from "../../common/components/pending-button";
import { planckToDOT } from "@interlay/polkabtc";

export default function StakedRelayerPage() {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isDeregisterPending, setDeregisterPending] = useState(false);
    const relayerNotRegisteredToastId = "relayer-not-registered-id";

    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);

    const [feesEarned, setFees] = useState("0");
    // store this in both DOT and Planck
    const [dotLocked, setDotLocked] = useState("0");
    const [planckLocked, setPlanckLocked] = useState("0");
    const [stakedRelayerAddress, setStakedRelayerAddress] = useState("");
    const [relayerRegistered, setRelayerRegistered] = useState(false);
    const [relayerInactive, setRelayerInactive] = useState(false);

    const handleReportModalClose = () => setShowReportModal(false);
    const handleRegisterModalClose = () => setShowRegisterModal(false);

    const deregisterStakedRelayer = async () => {
        if (!relayerLoaded) return;
        setDeregisterPending(true);
        try {
            await window.relayer.deregisterStakedRelayer();
            toast.success("Successfully Deregistered");
        } catch (error) {
            toast.error(error.toString());
        }
        setRelayerRegistered(false);
        setRelayerInactive(false);
        setDeregisterPending(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || !relayerLoaded) return;

            try {
                const address = await window.relayer.getAccountId();
                const stakedRelayerId = window.polkaBTC.api.createType("AccountId", address);
                const feesEarned = await window.polkaBTC.stakedRelayer.getFeesEarned(stakedRelayerId);
                setFees(feesEarned.toString());

                const isActive = await window.polkaBTC.stakedRelayer.isStakedRelayerActive(stakedRelayerId);
                const isInactive = await window.polkaBTC.stakedRelayer.isStakedRelayerInactive(stakedRelayerId);
                const isRegistered = isActive || isInactive;
                setRelayerRegistered(isRegistered);
                setRelayerInactive(isInactive);
                setStakedRelayerAddress(address);

                const lockedPlanck = (
                    await window.polkaBTC.stakedRelayer.getStakedDOTAmount(stakedRelayerId)
                ).toString();
                const lockedDOT = planckToDOT(lockedPlanck);

                // show warning if relayer is not registered with the parachain
                if (!isRegistered) {
                    toast.warn(
                        "Local relayer client running, but relayer is not yet registered with the parachain." +
                            " The client is already submitting blocks, but voting and reporting features are disabled until registered.",
                        { autoClose: false, toastId: relayerNotRegisteredToastId }
                    );
                }

                setDotLocked(lockedDOT);
                setPlanckLocked(lockedPlanck);
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded, relayerLoaded]);

    return (
        <div className="staked-relayer-page container-fluid white-background">
            <div className="staked-container dashboard-fade-in-animation">
                <div className="stacked-wrapper">
                    <div className="row">
                        <div className="title">Staked Relayer Dashboard</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Locked: {dotLocked} DOT</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="stats">Fees earned: {feesEarned}</div>
                        </div>
                    </div>
                    {!relayerRegistered && polkaBtcLoaded && (
                        <Button
                            variant="outline-success"
                            className="staked-button"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            Register (Lock DOT)
                        </Button>
                    )}
                    <BitcoinTable></BitcoinTable>
                    {relayerRegistered && (
                        <Button
                            variant="outline-danger"
                            className="staked-button"
                            disabled={relayerInactive}
                            onClick={() => setShowReportModal(true)}
                        >
                            Report Invalid Block
                        </Button>
                    )}
                    <ReportModal onClose={handleReportModalClose} show={showReportModal}></ReportModal>
                    <RegisterModal
                        onClose={handleRegisterModalClose}
                        onRegister={() => {
                            setRelayerRegistered(true);
                            setRelayerInactive(true);
                        }}
                        show={showRegisterModal}
                    ></RegisterModal>
                    <StatusUpdateTable
                        dotLocked={dotLocked}
                        planckLocked={planckLocked}
                        stakedRelayerAddress={stakedRelayerAddress}
                    ></StatusUpdateTable>
                    <VaultTable></VaultTable>
                    <OracleTable planckLocked={planckLocked}></OracleTable>
                    {relayerRegistered && (
                        <React.Fragment>
                            <ButtonMaybePending
                                className="staked-button"
                                variant="outline-danger"
                                isPending={isDeregisterPending}
                                disabled={relayerInactive || isDeregisterPending}
                                onClick={deregisterStakedRelayer}
                            >
                                Deregister
                            </ButtonMaybePending>
                            <div className="row">
                                <div className="col-12 de-note">
                                    Note: You can only deregister if you are not participating in a vote.
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}
