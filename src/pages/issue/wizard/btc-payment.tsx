import React from "react";
import { FormGroup, Modal, ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import  QRCode from "qrcode.react";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueStepAction } from "../../../common/actions/issue.actions";
import { btcToSat, satToMBTC } from "@interlay/polkabtc";
import Big from "big.js";
import { useTranslation } from "react-i18next";

type BTCPaymentProps = {
    closeModal: () => void;
};

export default function BTCPayment(props: BTCPaymentProps) {
    const { amountBTC, fee, wizardInEditMode, vaultBtcAddress } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();

    const amountBTCwithFee = new Big(fee).add(new Big(amountBTC));
    let amountMBTCwithFee = "";
    try {
        const amountSATwithFee = btcToSat(amountBTCwithFee.toString());
        amountMBTCwithFee = satToMBTC(amountSATwithFee ? amountSATwithFee : "");
    } catch (err) {
        console.log(err);
    }

    const dispatch = useDispatch();

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
    };

    const submit = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT_CONFIRMATION"));
        props.closeModal();
    };

    return (
        <React.Fragment>
            <Modal.Body>
                <FormGroup>
                    <p>
                        {t("issue_page.issuing",{amountBTC})}
                    </p>
                    <p>
                        {t("issue_page.exactly_one_payment")}
                    </p>
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>
                                {t("issue_page.recipient")} <strong>{vaultBtcAddress}</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                {t("issue_page.amont_with_fee")}
                                <strong>
                                    {amountBTCwithFee + "BTC (" + amountMBTCwithFee + "mBTC)"}
                                </strong>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>

                    <div className="row justify-content-center">
                        <div className="col-3">
                            <QRCode value={'bitcoin:' + vaultBtcAddress + '?amount=' + amountMBTCwithFee} />,
                        </div>
                    </div>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                {!wizardInEditMode && (
                    <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                        {t("previous")}
                    </button>
                )}
                <button className="btn btn-primary float-right" onClick={submit}>
                    {t("issue_page.made_payment")}
                </button>
            </Modal.Footer>
        </React.Fragment>
    );
}
