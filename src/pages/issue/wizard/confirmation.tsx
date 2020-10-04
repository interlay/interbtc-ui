import React from "react";
import { FormGroup, Row, Col, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default function Confirmation(props: IssueWizardProps) {
    if (props.step !== 4) {
        return null
    }

    return (
        <FormGroup>
            <h5>Confirm BTC Payment</h5>
            <Row className="justify-content-md-center">
                <Col md="auto" className="text-left">
                    <p>
                        <b>Please enter the transaction id of your Bitcoin payment:</b>
                        <FormControl
                            id="btcTxId"
                            name="btcTxId"
                            type="string"
                            value={props.btcTxId}
                            onChange={props.handleChange}
                        />
                        <br/>
                        <br/>
                        We will monitor your Bitcoin transaction and notify you when it has been confirmed
                        (You will see a "Confirm" button next to your issue request on the issue page).
                        <br/>
                        <br/>
                        <b>Note: Your Bitcoin payment can take up to an hour to confirm.</b>
                    </p>
                </Col>
                <button
                    className="btn btn-primary float-right"
                    type="submit">
                    I have made the Bitcoin payment
                </button>
            </Row>
        </FormGroup>
    );
}
