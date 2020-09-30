import React, { Component } from "react";
import { FormGroup, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";

interface BTCPaymentProps {
    loaded: boolean,
}

export default class BTCPayment extends Component<IssueWizardProps, BTCPaymentProps> {
    state: BTCPaymentProps = {
        loaded: false
    }

    async componentDidUpdate() {
        if (!this.state.loaded) {
            this.setState({
                loaded: true
            })
        }
    }

    render() {
        const amountBTCwithFee = (Number.parseFloat(this.props.amountBTC) + Number.parseFloat(this.props.feeBTC)).toString();
        if (this.props.step !== 3) {
            return null
        }
        return (
            <FormGroup>
                <h5>Confirmation and Payment</h5>
                    <p>You have requested to mint {this.props.amountBTC} PolkaBTC, incurring a fee of {this.props.feeBTC} BTC.</p>
                    <p>Please make the following Bitcoin payment.</p>
                <h5>Bitcoin Payment Details</h5>
                <p>Create a Bitcoin transaction with two outputs.</p>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>Output 1</ListGroupItem>
                        <ListGroupItem>OP_RETURN: <strong> 0xloremipsum </strong></ListGroupItem>
                        <ListGroupItem>Amount: <strong>0 BTC</strong></ListGroupItem>
                    </ListGroup>
                    <ListGroup>
                        <ListGroupItem>Output 2</ListGroupItem>
                        <ListGroupItem>Recipient: <strong>{this.props.vaultBTCAddress}</strong></ListGroupItem>
                        <ListGroupItem>Amount: <strong>{amountBTCwithFee} BTC</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
            </FormGroup>
        )
    }
}