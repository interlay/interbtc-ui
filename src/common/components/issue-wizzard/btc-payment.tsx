import React, { Component } from "react";
import { FormGroup, ListGroup, ListGroupItem, Row, Col, FormControl } from "react-bootstrap";
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
        if (this.props.step !== 3) {
            return null
        }
        return (
            <FormGroup>
                <h5>Confirmation and Payment</h5>
                <p> You have requested to mint {this.props.amountBTC} PolkaBTC, incurring a fee of {this.props.feeBTC} BTC.</p>
                <Row className="justify-content-md-center">
                    <Col md="auto" className="text-center">
                        <p>Please make the following Bitcoin payment.</p>
                    </Col>
                </Row>
                <h5>Summary</h5>
                <FormGroup>
                    <ListGroup>
                        <ListGroupItem>BTC to send: <strong>{amountBTCwithFee}</strong></ListGroupItem>
                        <ListGroupItem>OP_RETURN content: <strong> 0xloremipsum </strong></ListGroupItem>
                        <ListGroupItem>BTC recipient: <strong>{this.props.vaultBTCAddress}</strong></ListGroupItem>
                        <ListGroupItem>PolkaBTC to receive: <strong>{this.props.amountBTC}</strong></ListGroupItem>
                    </ListGroup>
                </FormGroup>
            </FormGroup>
        )
    }
}