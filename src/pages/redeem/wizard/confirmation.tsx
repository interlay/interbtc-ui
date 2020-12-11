import React, { useState, useEffect } from "react";
import { FormGroup, ListGroup, Row, Col, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import {
    changeRedeemIdAction,
    changeRedeemStepAction,
    addRedeemRequestAction,
} from "../../../common/actions/redeem.actions";
import { updateBalancePolkaBTCAction } from "../../../common/actions/general.actions";
import { toast } from "react-toastify";
import { RedeemRequest } from "../../../common/types/redeem.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat } from "@interlay/polkabtc";
import Big from "big.js";
import { useTranslation } from 'react-i18next';


export default function Confirmation() {
    const { t } = useTranslation();
    const [isRequestPending, setRequestPending] = useState(false);
    const { balancePolkaBTC, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
    const { amountPolkaBTC, vaultDotAddress, btcAddress, fee } = useSelector((store: StoreType) => store.redeem);
    const dispatch = useDispatch();

    useEffect(() => {

    })

    const onConfirm = async () => {
        if (!polkaBtcLoaded) return;

        setRequestPending(true);
        // send the redeem request
        try {
            const amountPolkaSAT = btcToSat(amountPolkaBTC);
            if (amountPolkaSAT === undefined) {
                throw new Error("Invalid PolkaBTC amount input");
            }
            const amount = window.polkaBTC.api.createType("Balance", amountPolkaSAT);

            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultDotAddress);
            const requestResult = await window.polkaBTC.redeem.request(amount, btcAddress, vaultAccountId);

            // get the redeem id from the request redeem event
            const id = requestResult.hash.toString();
            const redeemRequest = await window.polkaBTC.redeem.getRequestById(id);

            // update the redeem status
            dispatch(changeRedeemIdAction(id));

            const request: RedeemRequest = {
                id,
                amountPolkaBTC,
                creation: redeemRequest.opentime.toString(),
                fee: "0.5", // FILIP TO CHANGE VALUE
                btcAddress,
                btcTxId: "",
                confirmations: 0,
                completed: false,
                isExpired: false,
            };
            dispatch(addRedeemRequestAction(request));
            dispatch(changeRedeemStepAction("VAULT_INFO"));
            dispatch(updateBalancePolkaBTCAction(new Big(balancePolkaBTC).sub(new Big(amountPolkaBTC)).toString()));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    };

    const goToPreviousStep = () => {
        dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
    };

    return (
        <React.Fragment>
            <Modal.Body>
                <FormGroup>
                    <h5>{t("redeem_page.confirm_redeem")}</h5>
                    <p>{t("redeem_page.verify_and_confirm")}</p>
                    <Row className="justify-content-md-center">
                        <Col md="auto" className="text-left">
                            <FormGroup>
                                <ListGroup>
                                    <ListGroupItem>
                                        {t("redeem_page.burning")}: <strong>{amountPolkaBTC} PolkaBTC</strong>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        {t("redeem_page.your_btc_address")}: <strong>{btcAddress}</strong>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        {t("fee")}: <strong>{fee + " PolkaBTC"}</strong>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        {t("redeem_page.receiving")}: 
                                        <strong>
                                            {(new Big(amountPolkaBTC).sub(new Big(fee))).toString() + " BTC"}
                                        </strong>
                                    </ListGroupItem>
                                </ListGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    {t("previous")}
                </button>
                <ButtonMaybePending
                    className="btn btn-primary float-right"
                    isPending={isRequestPending}
                    onClick={onConfirm}
                >
                    {t("confirm")}
                </ButtonMaybePending>
            </Modal.Footer>
        </React.Fragment>
    );
}
