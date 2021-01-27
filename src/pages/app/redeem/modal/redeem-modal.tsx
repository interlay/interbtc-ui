import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../../../../common/types/util.types";
import { Modal } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { shortAddress } from "../../../../common/utils/utils";
import StatusView from "./status-view";
import Big from "big.js";
import BitcoinLogo from "../../../../assets/img/Bitcoin-Logo.png";
import { Prices } from "../../../../common/types/util.types";
import { calculateAmount } from "../../../../common/utils/utils";


type RedeemModalProps = {
    show: boolean;
    onClose: () => void;
}

export default function RedeemModal(props: RedeemModalProps) {
    const { address } = useSelector((state: StoreType) => state.general);
    const selectedIdRequest = useSelector((state: StoreType) => state.redeem.id);
    const redeemRequests = useSelector((state: StoreType) => state.redeem.redeemRequests).get(address) || [];
    const request = redeemRequests.filter((request) => request.id === selectedIdRequest)[0];
    const [usdAmount, setUsdAmount] = useState("0");
    const { t } = useTranslation();

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd").then((response) => {
            return response.json() as Promise<Prices>;
        }).then((prices) => {
            const amount = calculateAmount(request.amountPolkaBTC,prices.bitcoin.usd.toString());
            setUsdAmount(amount); 
        });
    });

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
                            <span className="wizzard-number">{request.amountPolkaBTC}</span>&nbsp;polkaBTC
                        </div>
                        <div className="row usd-price-modal">
                            <div className="col">
                                {"= $"+ usdAmount}
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
                                {((new Big(request.amountPolkaBTC)).sub(new Big(request.fee))).toString()} BTC
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
