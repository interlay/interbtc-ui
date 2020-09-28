import React, { Component } from "react";
import { FormGroup, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import { IssueWizardProps } from "./issue-wizard";
import QRCode from "qrcode.react";

interface BTCPaymentProps {
    paymentUri: string,
    loaded: boolean,
}

export default class BTCPayment extends Component<IssueWizardProps, BTCPaymentProps> {
    state: BTCPaymentProps = {
        paymentUri: '',
        loaded: false
    }

    async componentDidUpdate() {
        if (!this.state.loaded) {
        const paymentUri = 'bitcoin:' + this.props.vaultBTCAddress + '?amount=' + this.props.amountBTC;
        this.setState({
            paymentUri: paymentUri,
            loaded: true
        })
        }
    }

    render() {
        const amountBTCwithFee = (Number.parseFloat(this.props.amountBTC) + Number.parseFloat(this.props.feeBTC)).toString();
        console.log(this.props.step);
        if (this.props.step !== 3) {
        return null
        }
        return (
        <FormGroup>
            <h5>Payment</h5>
            <Row className="justify-content-md-center">
                <Col md="auto" className="text-center">
                    <p>To receive PolkaBTC you need to transfer the following BTC amount to a vault.</p>
                    <QRCode value={this.state.paymentUri} />
                </Col>
            </Row>
            <h5>Summary</h5>
            <FormGroup>
                <ListGroup>
                    <ListGroupItem>Sending: <strong>{amountBTCwithFee} BTC</strong></ListGroupItem>
                    <ListGroupItem>Vault address: <strong>{this.props.vaultBTCAddress}</strong></ListGroupItem>
                    <ListGroupItem>Receiving: <strong>{this.props.amountBTC} PolkaBTC</strong></ListGroupItem>
                </ListGroup>
            </FormGroup>
        </FormGroup>
        )
    }
}