import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getUsdAmount, shortAddress } from "../../../../common/utils/utils";
import StatusView from "./status-view";
import BitcoinLogo from "../../../../assets/img/small-bitcoin-logo.png";
import ReimburseView from "./reimburse-view";
import { RedeemRequestStatus } from "../../../../common/types/redeem.types";

type RedeemModalProps = {
    show: boolean;
    onClose: () => void;
};

export default function RedeemModal(props: RedeemModalProps): ReactElement {
    const { address, prices } = useSelector((state: StoreType) => state.general);
    const selectedIdRequest = useSelector((state: StoreType) => state.redeem.id);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
    const request = redeemRequests.filter((request) => request.id === selectedIdRequest)[0];
    const { t } = useTranslation();

    return (
        <Modal className="redeem-modal" show={props.show} onHide={props.onClose} size={"xl"}>
            {request && (
                <React.Fragment>
                    <div className="redeem-modal-title">{t("issue_page.request", { id: request.id })}</div>
                    <i className="fas fa-times close-icon" onClick={props.onClose}></i>
                    <div className="redeem-modal-horizontal-line"></div>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6 justify-content-center">
                                <div className="redeem-amount">
                                    <span className="wizzard-number">{request.totalAmount}</span>&nbsp;PolkaBTC
                                </div>
                                <div className="row usd-price-modal">
                                    <div className="col">
                                        {"~ $" + getUsdAmount(request.totalAmount || "0", prices.bitcoin.usd)}
                                    </div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6">{t("bridge_fee")}</div>
                                    <div className="col-6">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>{" "}
                                        &nbsp;
                                        {request.fee} BTC
                                        <div className="send-price">
                                            {"~ $" + getUsdAmount(request.fee, prices.bitcoin.usd)}
                                        </div>
                                    </div>
                                </div>
                                <hr className="total-divider"></hr>
                                <div className="step-item row">
                                    <div className="col-6 total-amount">{t("you_will_receive")}</div>
                                    <div className="col-6 total-amount">
                                        <img src={BitcoinLogo} width="23px" height="23px" alt="bitcoin logo"></img>
                                        &nbsp;
                                        {request.amountPolkaBTC} BTC
                                        <div className="send-price">
                                            {"~ $" + getUsdAmount(request.amountPolkaBTC, prices.bitcoin.usd)}
                                        </div>
                                    </div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.destination_address")}</div>
                                    <div className="col-6">{shortAddress(request.btcAddress || "")}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.parachain_block")}</div>
                                    <div className="col-6">{request.creation}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.vault_dot_address_modal")}</div>
                                    <div className="col-6">{shortAddress(request.vaultDotAddress || "")}</div>
                                </div>
                                <div className="step-item row">
                                    <div className="col-6 text-left">{t("issue_page.vault_btc_address")}</div>
                                    <div className="col-6">{shortAddress(request.btcAddress)}</div>
                                </div>
                            </div>
                            <div className="col-6">
                                {request.status === RedeemRequestStatus.Expired ? (
                                    <ReimburseView request={request} onClose={props.onClose} />
                                ) : (
                                    <StatusView request={request} />
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            )}
        </Modal>
    );
}
