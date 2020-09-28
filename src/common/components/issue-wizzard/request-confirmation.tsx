import React, { Component } from "react";
import { FormGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

export default class RequestConfirmation extends Component<IssueWizardProps, {}> {
    render() {
      if (this.props.step !== 2) {
        return null
      }
      return (
        <FormGroup>
          <h5>Summary</h5>
            <FormGroup>
                <ListGroup>
                  <ListGroupItem>
                    Fees: <strong>{this.props.feeBTC} BTC</strong>
                  </ListGroupItem>
                  <ListGroupItem>Vault address: <strong>{this.props.vaultBTCAddress}</strong></ListGroupItem>
                  <ListGroupItem>Receiving: <strong>{this.props.amountBTC} PolkaBTC</strong></ListGroupItem>
                </ListGroup>
            </FormGroup>
        </FormGroup>
      )
    }
  }