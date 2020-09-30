import React from "react";
import { FormGroup, Row, Col, FormControl } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default function Confirmation (props: IssueWizardProps){
  if (props.step !== 3) {
    return null
  }
  
  return <FormGroup>
      <h5>Confirm BTC Payment</h5>
        <Row className="justify-content-md-center">
          <Col md="auto" className="text-left">
              <p>
                <b>Please enter the TXID of your Bitcoin payment:</b>
                <FormControl
                id="transactionBTC"
                name="transactionBTC"
                type="string"
                value={props.transactionBTC}
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
      </Row>
    </FormGroup>
}
  