import React, { useState, useEffect } from "react";
import BitcoinTable from "./bitcoin-table/bitcoin-table";
import ReportModal from "./report-modal/report-modal";
import RegisterModal from "./register-modal/register-modal";
import { Button } from "react-bootstrap";
import StatusUpdateTable from "./status-update-table/status-update-table";
import VaultTable from "./vault-table/vault-table";
import OracleTable from "./oracle-table/oracle-table";
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

    const polkaBTC = useSelector((state: StoreType) => state.api);
    const stakedRelayer = useSelector((state: StoreType) => state.relayer);

    const [feesEarned, setFees] = useState("0");
    // store this in both DOT and Planck
    const [dotLocked, setDotLocked] = useState("0");
    const [planckLocked, setPlanckLocked] = useState("0");
    const [stakedRelayerAddress, setStakedRelayerAddress] = useState("");

    const handleReportModalClose = () => setShowReportModal(false);
    const handleRegisterModalClose = () => setShowRegisterModal(false);

    const deregisterStakedRelayer = async () => {
        if (!stakedRelayer) return;
        setDeregisterPending(true);
        try {
            await stakedRelayer.deregisterStakedRelayer();
            toast.success("Successfully Deregistered");
        } catch (error) {
            toast.error(error.toString());
        }
        setDeregisterPending(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC || !stakedRelayer) return;

            const address = await stakedRelayer.getAddress();
            const activeStakedRelayerId = polkaBTC.api.createType("AccountId", address);

            const feesEarned = await polkaBTC.stakedRelayer.getFeesEarned(activeStakedRelayerId);
            setFees(feesEarned.toString());

            setStakedRelayerAddress(address);

            const lockedPlanck = (await polkaBTC.stakedRelayer.getStakedDOTAmount(activeStakedRelayerId)).toString();
            const lockedDOT = planckToDOT(lockedPlanck);
            setDotLocked(lockedDOT);
            setPlanckLocked(lockedPlanck);
        };
        fetchData();
    });

    return (
        <div className="staked-relayer-page container-fluid">
            <div className="stacked-container">
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
                    {Number(planckLocked) === 0 && (
                        <Button
                            variant="outline-success"
                            className="staked-button"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            Register (Lock DOT)
                        </Button>
                    )}
                    <BitcoinTable></BitcoinTable>
                    {Number(planckLocked) > 0 && (
                        <Button
                            variant="outline-danger"
                            className="staked-button"
                            onClick={() => setShowReportModal(true)}
                        >
                            Report Invalid Block
                        </Button>
                    )}
                    <ReportModal onClose={handleReportModalClose} show={showReportModal}></ReportModal>
                    <RegisterModal onClose={handleRegisterModalClose} show={showRegisterModal}></RegisterModal>
                    <StatusUpdateTable
                        dotLocked={dotLocked}
                        planckLocked={planckLocked}
                        stakedRelayerAddress={stakedRelayerAddress}
                    ></StatusUpdateTable>
                    <VaultTable></VaultTable>
                    <OracleTable planckLocked={planckLocked}></OracleTable>
                    {Number(planckLocked) > 0 && <React.Fragment>
                        <ButtonMaybePending
                            className="staked-button"
                            variant="outline-danger"
                            isPending={isDeregisterPending}
                            onClick={deregisterStakedRelayer}
                        >
                            Deregister
                        </ButtonMaybePending>
                        <div className="row">
                            <div className="col-12 de-note">
                                Note: You can only deregister if you are not participating in a vote.
                            </div>
                        </div>
                    </React.Fragment>}
                </div>
            </div>
        </div>
    );
}
