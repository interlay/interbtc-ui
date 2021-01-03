import React from "react";
import { FormGroup, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { StoreType } from "../../../common/types/util.types";
import { changeIssueStepAction } from "../../../common/actions/issue.actions";
import { btcToSat, satToMBTC } from "@interlay/polkabtc";
import Big from "big.js";
import { useTranslation } from "react-i18next";


export default function BTCPayment() {
    const { id, amountBTC, fee, wizardInEditMode } = useSelector((state: StoreType) => state.issue);
    const { t } = useTranslation();

    const amountBTCwithFee = new Big(fee).add(new Big(amountBTC));
    let amountMBTCwithFee = "";
    try {
        const amountSATwithFee = btcToSat(amountBTCwithFee.toString());
        amountMBTCwithFee = satToMBTC(amountSATwithFee ? amountSATwithFee : "");
    } catch (err) {
        console.log(err);
    }

    const vaultBTCAddress = useSelector((state: StoreType) => state.issue.vaultBtcAddress);
    const dispatch = useDispatch();

    const electrumPaytoField = vaultBTCAddress + ", " + amountMBTCwithFee + "\nOP_RETURN " + id + ", 0";

    const goToPreviousStep = () => {
        dispatch(changeIssueStepAction("REQUEST_CONFIRMATION"));
    };

    const goToNextStep = () => {
        dispatch(changeIssueStepAction("BTC_PAYMENT_CONFIRMATION"));
    };

    return (
        <React.Fragment>
            <Modal.Body>
                <FormGroup>
                    <h5>{t("issue_page.confirmation_and_payment")}</h5>
                    <p>
                        {t("issue_page.requested_to_mint",{amountBTC, fee})}
                    </p>
                    <p>
                        {t("issue_page.following_payment")}
                        <b className="warning-color">{t("issue_page.within_24_hours")}</b>.
                    </p>
                    <p className="warning-color">
                        <b>
                            {t("issue_page.exactly_one_payment")}
                        </b>
                    </p>
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>{t("issue_page.output_1")}</ListGroupItem>
                            <ListGroupItem>
                                {t("issue_page.recipient")} <strong>{vaultBTCAddress}</strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                {t("issue_page.amont_with_fee")}
                                <strong>
                                    {amountBTCwithFee + "BTC (" + amountMBTCwithFee + "mBTC)"}
                                </strong>
                            </ListGroupItem>
                        </ListGroup>
                        <ListGroup>
                            <ListGroupItem>{t("issue_page.output_2")}</ListGroupItem>
                            <ListGroupItem>
                                OP_RETURN: <strong> {id} </strong>
                            </ListGroupItem>
                            <ListGroupItem>
                                {t("issue_page.amont_with_fee")} <strong>0 BTC (0 mBTC)</strong>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>
                    {t("issue_page.using_electrum")}
                    <br /> {t("issue_page.copied_values_are")} <strong>mBTC</strong> (1 mBTC = 0.001 BTC).
                    <FormGroup>
                        <ListGroup>
                            <ListGroupItem>
                                <strong>
                                    {electrumPaytoField.split("\n").map((str, index) => (
                                        <div key={index}>{str}</div>
                                    ))}
                                </strong>
                                <CopyToClipboard text={electrumPaytoField}>
                                    <button className="btn btn-outline-dark float-right">Copy</button>
                                </CopyToClipboard>
                            </ListGroupItem>
                        </ListGroup>
                    </FormGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                {!wizardInEditMode && (
                    <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                        {t("previous")}
                    </button>
                )}
                <button className="btn btn-primary float-right" onClick={goToNextStep}>
                    {t("next")}
                </button>
            </Modal.Footer>
        </React.Fragment>
    );
}
