import React, { useState } from "react";
import { FormGroup, ListGroup, Row, Col, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../../common/types/util.types";
import { changeRedeemIdAction, changeRedeemStepAction } from "../../../common/actions/redeem.actions";
import { toast } from "react-toastify";
import { RedeemRequest } from "../../../common/types/redeem.types";
import ButtonMaybePending from "../../../common/components/pending-button";
import { PolkaBTC } from "@interlay/polkabtc/build/interfaces/default";
import { btcToSat } from "@interlay/polkabtc";

export default function Confirmation() {
    const [isRequestPending, setRequestPending] = useState(false);
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);
    const amountPolkaBTC = useSelector((store: StoreType) => store.redeem.amountPolkaBTC);
    const vaultAddress = useSelector((store: StoreType) => store.redeem.vaultDotAddress);
    const vaultBTCAddress = useSelector((store: StoreType) => store.redeem.vaultBtcAddress);
    const btcAddress = useSelector((store: StoreType) => store.redeem.btcAddress);
    const dispatch = useDispatch();

    const onConfirm = async () => {
        setRequestPending(true);
        // send the redeem request
        try {
            const amountPolkaSAT = btcToSat(amountPolkaBTC);
            const amount = polkaBTC.api.createType("Balance", amountPolkaSAT);
            // FIXME: use AccountId type from @polkadot/types/interfaces
            const vaultAccountId = polkaBTC.api.createType("AccountId", vaultAddress) as any;
            const requestResult = await polkaBTC.redeem.request(amount, btcAddress, vaultAccountId);

            // get the redeem id from the request redeem event
            const id = requestResult.hash.toString();

            // update the redeem status 
            dispatch(changeRedeemIdAction(id));

            // store the redeem request in storage
            const request: RedeemRequest = {
                id,
                amountPolkaBTC,
                creation: new Date(),
                vaultBTCAddress,
                btcTxId: "",
                confirmations: 0,
                completed: false,
            }
            storage.appendRedeemRequest(request); 
            dispatch(changeRedeemStepAction("VAULT_INFO"));
        } catch (error) {
            toast.error(error.toString());
        }
        setRequestPending(false);
    }

    const goToPreviousStep = () => {
        dispatch(changeRedeemStepAction("ENTER_BTC_ADDRESS"));
    }

    return <React.Fragment>
        <Modal.Body>
            <FormGroup>
                <h5>Confirm Redeem Request</h5>
                <p>Please verify and confirm your redeem request.</p>
                <Row className="justify-content-md-center">
                    <Col md="auto" className="text-left">
                        <FormGroup>
                            <ListGroup>
                                <ListGroupItem>Burning: <strong>{amountPolkaBTC} PolkaBTC</strong></ListGroupItem>
                                <ListGroupItem>
                                    Your Bitcoin address: <strong>{btcAddress}</strong>
                                </ListGroupItem>
                                <ListGroupItem>Receiving: <strong>{amountPolkaBTC} BTC</strong></ListGroupItem>
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
            <ButtonMaybePending className="btn btn-primary float-right" isPending={isRequestPending} onClick={onConfirm}>
                Confirm
            </ButtonMaybePending>
        </Modal.Footer>
    </React.Fragment>
}