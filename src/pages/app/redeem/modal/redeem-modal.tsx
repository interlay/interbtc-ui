import React from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { shortAddress } from "../../../../common/utils/utils";
import StatusView from "./status-view";
import BitcoinLogo from "../../../../assets/img/Bitcoin-Logo.png";
import { calculateAmount } from "../../../../common/utils/utils";


type RedeemModalProps = {
    show: boolean;
    onClose: () => void;
}

export default function RedeemModal(props: RedeemModalProps) {
    const { address, prices } = useSelector((state: StoreType) => state.general);
    const selectedIdRequest = useSelector((state: StoreType) => state.redeem.id);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
    const request = redeemRequests.filter((request) => request.id === selectedIdRequest)[0];
    const { t } = useTranslation();

    return <Modal show={props.show} onHide={props.onClose} size={"xl"}>
            <Modal.Header closeButton>
            </Modal.Header>
        <Modal.Body>
            {request &&
                <div className="row">
                    <div className="col-6 justify-content-center">
                        <div className="wizard-title">
                            {t("redeem_page.redeem_request_for")}
                        </div>
                        <div className="issue-amount">
                            <span className="wizzard-number">{request.amountPolkaBTC}</span>&nbsp;PolkaBTC
                        </div>
                        <div className="row usd-price-modal">
                            <div className="col">
                                {"= $"+ calculateAmount(request.amountPolkaBTC || "0",prices.bitcoin.usd)}
                            </div>
                        </div>
                        <div className="step-item row">
                            <div className="col-6">{t("redeem_page.redeem_id")}</div>
                            <div className="col-6">{shortAddress(request.id)}</div>
                        </div>
                        <div className="step-item row">
                            <div className="col-6">{t("issue_page.parachain_block")}</div>
                            <div className="col-6">{shortAddress(request.creation)}</div>
                        </div>
                        <div className="step-item row">
                            <div className="col-6">{t("nav_vault")}</div>
                            <div className="col-6">{shortAddress(request.vaultDotAddress || "")}</div>
                        </div>
                        <div className="step-item row">
                            <div className="col-6">{t("bridge_fee")}</div>
                            <div className="col-6">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                {request.fee} BTC
                            </div>
                        </div>
                        <hr className="total-divider"></hr>
                        <div className="step-item row">
                            <div className="col-6 total-amount">{t("redeem_page.amount_received")}</div>
                            <div className="col-6 total-amount">
                                <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                {request.totalAmount} BTC
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <StatusView request={request}/>
                    </div>
                </div>
            }
        </Modal.Body>
    </Modal>
}
