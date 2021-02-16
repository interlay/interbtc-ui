import React from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { shortAddress } from "../../../../common/utils/utils";
import PaymentView from "./payment-view";
import StatusView from "./status-view";
import WhopsView from "./whoops-view";
import Big from "big.js";
import BitcoinLogo from "../../../../assets/img/Bitcoin-Logo.png";
import { calculateAmount } from "../../../../common/utils/utils";
import { IssueRequestStatus } from "../../../../common/types/issue.types";

type IssueModalProps = {
    show: boolean;
    onClose: () => void;
};

export default function IssueModal(props: IssueModalProps) {
    const { prices } = useSelector((state: StoreType) => state.general);
    const { selectedRequest } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();
    const request = selectedRequest;

    return (
        <Modal show={props.show} onHide={props.onClose} size={"xl"}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                {request && (
                    <div className="row">
                        <div className="col-6 justify-content-center">
                            <div className="wizard-title">{t("issue_page.issue_request_for")}</div>
                            <div className="issue-amount">
                                <span className="wizzard-number">{request.amountBTC}</span>&nbsp;PolkaBTC
                            </div>
                            <div className="row usd-price-modal">
                                <div className="col">
                                    {"= $" + calculateAmount(request.amountBTC || "0", prices.bitcoin.usd)}
                                </div>
                            </div>
                            <div className="step-item row">
                                <div className="col-6">{t("issue_page.issue_id")}</div>
                                <div className="col-6">{shortAddress(request.id)}</div>
                            </div>
                            <div className="step-item row">
                                <div className="col-6">{t("issue_page.parachain_block")}</div>
                                <div className="col-6">{shortAddress(request.creation)}</div>
                            </div>
                            <div className="step-item row">
                                <div className="col-6">{t("nav_vault")}</div>
                                <div className="col-6">{shortAddress(request.vaultDOTAddress)}</div>
                            </div>
                            <div className="step-item row">
                                <div className="col-6">{t("issue_page.vault_btc_address")}</div>
                                <div className="col-6">{shortAddress(request.vaultBTCAddress)}</div>
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
                                <div className="col-6 total-amount">{t("total_deposit")}</div>
                                <div className="col-6 total-amount">
                                    <img src={BitcoinLogo} width="40px" height="23px" alt="bitcoin logo"></img>
                                    {new Big(request.fee).add(new Big(request.amountBTC)).toString()} BTC
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            {!request.btcTxId &&
                            request.status !== IssueRequestStatus.Cancelled &&
                            request.status !== IssueRequestStatus.Completed &&
                            request ? (
                                <PaymentView request={request} />
                            ) : (
                                <StatusView request={request} />
                            )}
                            {false && request && <WhopsView request={request} />}
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}
