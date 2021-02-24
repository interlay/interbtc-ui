import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { shortAddress } from "../../../../common/utils/utils";
import PaymentView from "./payment-view";
import StatusView from "./status-view";
import WhopsView from "./whoops-view";
import Big from "big.js";
import BitcoinLogo from "../../../../assets/img/small-bitcoin-logo.png";
import { calculateAmount } from "../../../../common/utils/utils";
import { IssueRequestStatus } from "../../../../common/types/issue.types";

type IssueModalProps = {
    show: boolean;
    onClose: () => void;
};

export default function IssueModal(props: IssueModalProps): ReactElement {
    const { prices } = useSelector((state: StoreType) => state.general);
    const { selectedRequest, issueRequests, address } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();
    const allRequests = issueRequests.get(address) || [];
    const request = allRequests.filter((req) => req.id === (selectedRequest ? selectedRequest.id : ""))[0];

    return (
        <Modal className="issue-modal" show={props.show} onHide={props.onClose} size={"xl"}>
            {request && (
                <React.Fragment>
                    <div className="issue-modal-title">{t("issue_page.request", { id: shortAddress(request.id) })}</div>
                    <i className="fas fa-times close-icon" onClick={props.onClose}></i>

                    <div className="issue-modal-horizontal-line"></div>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6 justify-content-center">
                                <div className="issue-amount">
                                    <span className="wizzard-number">{request.amountPolkaBTC}</span>&nbsp;BTC
                                </div>
                                <div className="row usd-price-modal">
                                    <div className="col">
                                        {"~ $" + calculateAmount(request.amountPolkaBTC || "0", prices.bitcoin.usd)}
                                    </div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("bridge_fee")}</div>
                                    <div className="col-6 right-text">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>{" "}
                                        &nbsp;
                                        {parseFloat(Number(request.fee).toFixed(5))} BTC
                                        <div className="send-price">
                                            {"~ $" + parseFloat((Number(request.fee) * prices.bitcoin.usd).toFixed(5))}
                                        </div>
                                    </div>
                                </div>
                                <hr className="total-divider"></hr>
                                <div className="step-item row">
                                    <div className="col-6 total-added-value text-left">{t("total_deposit")}</div>
                                    <div className="col-6 total-amount right-text">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>{" "}
                                        &nbsp;
                                        {parseFloat(
                                            new Big(request.fee)
                                                .add(new Big(request.amountPolkaBTC))
                                                .round(5)
                                                .toString()
                                        )}{" "}
                                        BTC
                                        <div className="send-price">
                                            {"~ $" +
                                                parseFloat(
                                                    (Number(request.amountPolkaBTC) * prices.bitcoin.usd).toFixed(5)
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className="step-item row mt-2">
                                    <div className="col-6 text-left">{t("issue_page.destination_address")}</div>
                                    <div className="col-6 right-text">{shortAddress(request.vaultBTCAddress)}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.parachain_block")}</div>
                                    <div className="col-6 right-text">{request.creation}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.vault_dot_address_modal")}</div>
                                    <div className="col-6 right-text">{shortAddress(request.vaultDOTAddress)}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.vault_btc_address")}</div>
                                    <div className="col-6 right-text">{shortAddress(request.vaultBTCAddress)}</div>
                                </div>
                                <div className="row justify-content-center mt-3">
                                    <div className="col-9 note-title">{t("note")}:&nbsp;</div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-9 note-text">{t("issue_page.fully_decentralised")}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                {request && request.status === IssueRequestStatus.PendingWithBtcTxNotFound ? (
                                    <PaymentView request={request} />
                                ) : (
                                    <StatusView request={request} />
                                )}
                                {false && request && <WhopsView request={request} />}
                            </div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            )}
        </Modal>
    );
}
