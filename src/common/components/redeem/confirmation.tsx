import React from "react";
import { FormGroup, ListGroup, Row, Col, ListGroupItem, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../../types/util.types";
import { changeRedeemStepAction } from "../../actions/redeem.actions";

export default function Confirmation (){
    const amountPolkaBTC = useSelector((store: StoreType)=>store.redeem.amountPolkaBTC);
    const btcAddress = useSelector((store: StoreType)=>store.redeem.btcAddress);
    const dispatch = useDispatch();

    const onConfirm = ()=>{
        dispatch(changeRedeemStepAction("VAULT_INFO"));
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
            Next
        </button>
    </Modal.Footer>
</React.Fragment>    
}