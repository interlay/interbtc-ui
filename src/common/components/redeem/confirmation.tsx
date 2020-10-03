import React from "react";
import { FormGroup, ListGroup, Row, Col, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/util.types";
import { changeRedeemIdAction, changeRedeemStepAction } from "../../actions/redeem.actions";
import { toast } from "react-toastify";
import { RedeemRequest } from "../../types/redeem.types";

export default function Confirmation() {
    // const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);
    const amountPolkaBTC = useSelector((store: StoreType) => store.redeem.amountPolkaBTC);
    // const vaultAddress = useSelector((store: StoreType) => store.redeem.vaultDotAddress);
    const btcAddress = useSelector((store: StoreType) => store.redeem.btcAddress);
    const dispatch = useDispatch();

    const onConfirm = async () => {
        // send the redeem request
        try {
            // const amount = polkaBTC.api.createType("Balance", amountPolkaBTC) as any;
            // const requestResult = await polkaBTC.redeem.request(amount, btcAddress, vaultAddress);
            // const id = requestResult.hash.toString();
            const id = "test";
            const vaultBTCAddress = "test_address";

            // dispatch(changeRedeemIdAction(id))
            dispatch(changeRedeemIdAction(id))

            // TODO: store the redeem request in storage
            const request: RedeemRequest = {
                id,
                amountPolkaBTC: amountPolkaBTC.toString(),
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
            <button className="btn btn-primary float-right" onClick={onConfirm}>
                Confirm
        </button>
        </Modal.Footer>
    </React.Fragment>
}