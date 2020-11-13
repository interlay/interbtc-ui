import React, { useState } from "react";
import { FormGroup, ListGroup, Row, Col, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import {
    changeRedeemIdAction,
    changeRedeemStepAction,
    addRedeemRequestAction,
} from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { RedeemRequest } from "../../../common/types/redeem.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { btcToSat } from "@interlay/polkabtc";
import { getH160FromAddress } from "../../../common/utils/utils";

export default function Confirmation() {
    const [isRequestPending, setRequestPending] = useState(false);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const amountPolkaBTC = useSelector((store: StoreType) => store.redeem.amountPolkaBTC);
    const vaultAddress = useSelector((store: StoreType) => store.redeem.vaultDotAddress);
    const btcAddress = useSelector((store: StoreType) => store.redeem.btcAddress);
    const dispatch = useDispatch();

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

            const btcHash = getH160FromAddress(btcAddress);
            if (!btcHash) {
                throw new Error("Invalid address");
            }

            const vaultAccountId = window.polkaBTC.api.createType("AccountId", vaultAddress);
            const requestResult = await window.polkaBTC.redeem.request(amount, btcHash, vaultAccountId);

            // get the redeem id from the request redeem event
            const id = requestResult.hash.toString();
            const redeemRequest = await window.polkaBTC.redeem.getRequestById(id);

            // update the redeem status
            dispatch(changeRedeemIdAction(id));

            const request: RedeemRequest = {
                id,
                amountPolkaBTC,
                creation: redeemRequest.opentime.toString(),
                btcAddress,
                btcTxId: "",
                confirmations: 0,
                completed: false,
            };
            dispatch(addRedeemRequestAction(request));
            dispatch(changeRedeemStepAction("VAULT_INFO"));
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
                    <h5>Confirm Redeem Request</h5>
                    <p>Please verify and confirm your redeem request.</p>
                    <Row className="justify-content-md-center">
                        <Col md="auto" className="text-left">
                            <FormGroup>
                                <ListGroup>
                                    <ListGroupItem>
                                        Burning: <strong>{amountPolkaBTC} PolkaBTC</strong>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Your Bitcoin address: <strong>{btcAddress}</strong>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Receiving: <strong>{amountPolkaBTC} BTC</strong>
                                    </ListGroupItem>
                                </ListGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary float-left" onClick={goToPreviousStep}>
                    Previous
                </button>
                <ButtonMaybePending
                    className="btn btn-primary float-right"
                    isPending={isRequestPending}
                    onClick={onConfirm}
                >
                    Confirm
                </ButtonMaybePending>
            </Modal.Footer>
        </React.Fragment>
    );
}
