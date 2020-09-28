import React from "react";
import { FormGroup, Row, Col } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default function Confirmation (props: IssueWizardProps){
  if (props.step !== 4) {
    return null
  }
  
  return <FormGroup>
      <h5>Confirm BTC Payment</h5>
        <Row className="justify-content-md-center">
          <Col md="auto" className="text-left">
              <p>
                <b>Please confirm that you have made the Bitcoin payment.</b>
                <br/>
                <br/>
                We will monitor your Bitcoin transaction and notify you when it has been confirmed.

                <br/>
                <br/>
                You will then see a "Confirm" button next to your issue request to receive PolkaBTC.
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
}
  