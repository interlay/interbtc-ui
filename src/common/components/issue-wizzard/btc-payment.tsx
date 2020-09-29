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
        const paymentUri = 'bitcoin:' + this.props.vaultBTCAddress + '?amount=' + this.props.amountPolkaBTC;
        this.setState({
            paymentUri: paymentUri,
            loaded: true
        })
        }
    }

    render() {
        const amountPolkaBTCwithFee = (Number.parseFloat(this.props.amountPolkaBTC) + Number.parseFloat(this.props.feeBTC)).toString();
        console.log(this.props.step);
        if (this.props.step !== 2) {
            return null
        }
        return (
        <FormGroup>
            <h5>Payment</h5>
            <Row className="justify-content-md-center">
                <Col md="auto" className="text-center">
                    <p>Please send <strong>exact {amountPolkaBTCwithFee} BTC</strong> to <strong>{this.props.vaultBTCAddress}</strong> or scan the QR code below</p>
                    <QRCode value={this.state.paymentUri} />
                </Col>
            </Row>
        </FormGroup>
        )
    }
}