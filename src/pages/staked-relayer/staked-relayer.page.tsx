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
import { satToBTC, planckToDOT, roundTwoDecimals } from "@interlay/polkabtc";
import { useTranslation } from "react-i18next";

export default function StakedRelayerPage() {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isDeregisterPending, setDeregisterPending] = useState(false);
    const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState("0");
    const [feesEarnedDOT, setFeesEarnedDOT] = useState("0");
    const [dotLocked, setDotLocked] = useState("0");
    const [planckLocked, setPlanckLocked] = useState("0");
    const [stakedRelayerAddress, setStakedRelayerAddress] = useState("");
    const [relayerRegistered, setRelayerRegistered] = useState(false);
    const [relayerInactive, setRelayerInactive] = useState(false);
    const [sla, setSLA] = useState("0");
    const [apy, setAPY] = useState("0");
    const relayerNotRegisteredToastId = "relayer-not-registered-id";
    const { polkaBtcLoaded, relayerLoaded } = useSelector((state: StoreType) => state.general);
    const { t } = useTranslation();

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
                    toast.warn(t("relayer.warning_relayer_not_registered"), {
                        autoClose: false,
                        toastId: relayerNotRegisteredToastId,
                    });
                } else {
                    const slaScore = await window.polkaBTC.stakedRelayer.getSLA(stakedRelayerId.toString());
                    setSLA(slaScore);

                    const apyScore = await window.polkaBTC.stakedRelayer.getAPY(stakedRelayerId.toString());
                    setAPY(apyScore);

                    const feesPolkaSAT = await window.polkaBTC.stakedRelayer.getFeesPolkaBTC(
                        stakedRelayerId.toString()
                    );
                    setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT));

                    const feesPlanck = await window.polkaBTC.stakedRelayer.getFeesDOT(stakedRelayerId.toString());
                    setFeesEarnedDOT(planckToDOT(feesPlanck));
                }

                setDotLocked(lockedDOT);
                setPlanckLocked(lockedPlanck);
            } catch (error) {
                toast.error(error.toString());
            }
        };
        fetchData();
    }, [polkaBtcLoaded, relayerLoaded, t]);

    return (
        <div className="staked-relayer-page container-fluid white-background">
            <div className="staked-container dashboard-fade-in-animation dahboard-min-height">
                <div className="stacked-wrapper">
                    <div className="row">
                        <div className="title">{t("relayer.staked_relayer_dashboard")}</div>
                    </div>
                    {!relayerRegistered && polkaBtcLoaded ? (
                        <Button
                            variant="outline-success"
                            className="staked-button"
                            onClick={() => setShowRegisterModal(true)}
                        >
                            {t("relayer.register_dot")}
                        </Button>
                    ) : (
                        <div className="col-lg-10 offset-1">
                            <div className="row justify-content-center">
                                <div className="col-3">
                                    <div>{t("relayer.stake_locked")}</div>
                                    <span className="stats">{dotLocked.toString()}</span> DOT
                                </div>
                                <div className="col-3">
                                    <div>{t("fees_earned")}</div>
                                    <span className="stats">{feesEarnedPolkaBTC}</span> PolkaBTC
                                </div>
                                <div className="col-3">
                                    <div>{t("fees_earned")}</div>
                                    <span className="stats">{feesEarnedDOT}</span> DOT
                                </div>
                                <div className="col-3">
                                    <div>{t("sla_score")}</div>
                                    <span className="stats">{sla}</span>
                                </div>
                                <div className="col-3">
                                    <div>{t("apy")}</div>
                                    <span className="stats">~{roundTwoDecimals(apy)}</span> %
                                </div>
                            </div>
                        </div>
                    )}
                    <BitcoinTable></BitcoinTable>
                    {relayerRegistered && (
                        <Button
                            variant="outline-danger"
                            className="staked-button"
                            disabled={relayerInactive}
                            onClick={() => setShowReportModal(true)}
                        >
                            {t("relayer.report_invalid_block")}
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
                                {t("relayer.deregister")}
                            </ButtonMaybePending>
                            <div className="row">
                                <div className="col-12 de-note">{t("relayer.note_you_can_deregister")}</div>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}
