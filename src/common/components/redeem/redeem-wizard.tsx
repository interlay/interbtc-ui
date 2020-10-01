import React, { Component, ChangeEvent, FormEvent } from "react";
import EnterPolkaBTCAmount from "./enter-polkabtc-amount";
import { RedeemProps, RedeemRequest } from "./redeem-state";
import { Container, Modal, Form, FormGroup, FormControl, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import { shortAddress } from "../../utils/utils";

export interface RedeemWizardProps {
    step: number,
    redeemId: string,
    amountPolkaBTC: string,
    creation: string,
    userBTCAddress: string,
    vaultDOTAddress: string,
    vaultBTCAddress: string,
    feePolkaBTC: string,
    btcTxId: string,
    balancePolkaBTC: string,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default class RedeemWizard extends Component<RedeemProps, RedeemWizardProps> {
    state: RedeemWizardProps = {
        step: 1,
        redeemId: "3",
        amountPolkaBTC: "0",
        creation: "",
        userBTCAddress: "",
        vaultDOTAddress: "",
        vaultBTCAddress: "",
        feePolkaBTC: "",
        btcTxId: "...",
        balancePolkaBTC: "",
        handleChange: () => { },
    }

    constructor(props: RedeemProps &
    { addRedeemRequest: (req: RedeemRequest) => void; }
    ) {
        super(props);
        this._next = this._next.bind(this);
        this._prev = this._prev.bind(this);
        this.state.handleChange = this.handleChange.bind(this);
        this.state.balancePolkaBTC = this.props.kvstorage.getValue("balancePolkaBTC");
    }

    _next() {
        let step = this.state.step;
        if (!this.isValid(step - 1)) return;
        // If the current step is 2 or 3, then add one on "next" button click
        step = step >= 3 ? 4 : step + 1;
        this.setState({
            step: step
        })
        console.log(step);
    }

    _prev() {
        let step = this.state.step
        // If the current step is 2 or 3, then subtract one on "previous" button click
        step = step <= 1 ? 1 : step - 1
        this.setState({
            step: step
        })
    }

    isValid(step: number) {
        const { amountPolkaBTC } = this.state;
        let valid = [
            parseFloat(amountPolkaBTC) > 0 && parseFloat(amountPolkaBTC) <= parseFloat(this.props.balancePolkaBTC),
            true,
            true]
        return valid[step];
    }

    get previousButton() {
        let step = this.state.step;
        if (step !== 1) {
            return (
                <button
                    className="btn btn-secondary float-left"
                    type="button" onClick={() => this._prev()}>
                    Previous
                </button>
            )
        }
        return null;
    }

    get nextButton() {
        let step = this.state.step;
        if (step < 3) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={() => this._next()}>
                    Next
                </button>
            )
        } 
        else if (step === 3) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={() => this.confirmRedeem()}>
                    Confirm redeem request
                </button>
            )
        }
        return null;
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        let { name, value } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //TODO: call setter in RedeemPage
        let date: Date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        this.props.addRedeemRequest({
            id: this.state.redeemId,
            amountPolkaBTC: this.state.amountPolkaBTC,
            creation: date.toISOString(),
            vaultAddress: this.state.vaultDOTAddress,
            vaultBTCAddress: this.state.vaultBTCAddress,
            redeemAddress: this.state.userBTCAddress,
            btcTxId: "...",
            confirmations: 0,
            completed: false
        });
        this._next();
    }

    closeModal = async () => {
        this.props.handleClose();
    }

    render() {
        return (
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Redeem PolkaBTC
          </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <EnterPolkaBTCAmount {...this.state} />
                        <EnterBTCAddress {...this.state} />
                        <Confirmation {...this.state} />
                        <VaultInfo {...this.state} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {this.previousButton}
                    {this.nextButton}
                </Modal.Footer>
            </Container>
        )
    }
}

interface EnterBTCAmountProps {
    amountPolkaBTC: string
}

class EnterBTCAmount extends Component<RedeemWizardProps, EnterBTCAmountProps> {
    state: EnterBTCAmountProps = {
        amountPolkaBTC: this.props.amountPolkaBTC
    }

    constructor(props: RedeemWizardProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        // FIXME: this should also update the amountPolkaBTC in the parent
        let { name, value } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
        this.props.handleChange(event);
    }

    render() {
        if (this.props.step !== 1) {
            return null
        }
        return (
            <FormGroup>
                <p>How much PolkaBTC do you want to redeem for BTC?</p>
                <p>You have {this.props.balancePolkaBTC} PolkaBTC</p>
                <FormControl
                    id="amountPolkaBTC"
                    name="amountPolkaBTC"
                    type="string"
                    value={this.props.amountPolkaBTC}
                    onChange={this.props.handleChange}
                />
            </FormGroup>
        )
    }
}


interface EnterBTCAddressProps {
    amountPolkaBTC: string
}

class EnterBTCAddress extends Component<RedeemWizardProps, EnterBTCAddressProps> {
    state: EnterBTCAddressProps = {
        amountPolkaBTC: this.props.amountPolkaBTC
    }

    constructor(props: RedeemWizardProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        // FIXME: this should also update the amountPolkaBTC in the parent
        let { name, value } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
        this.props.handleChange(event);
    }

    render() {
        if (this.props.step !== 2) {
            return null
        }
        return (
            <FormGroup>
                <p>Please enter your Bitcoin address</p>
                <FormControl
                    id="userBTCAddress"
                    name="userBTCAddress"
                    type="string"
                    value={this.props.userBTCAddress}
                    onChange={this.props.handleChange}
                />
            </FormGroup>
        )
    }
}


class Confirmation extends Component<RedeemWizardProps, {}> {
    render() {
        console.log(this.props.step);
        if (this.props.step !== 3) {
            return null
        }
        return (
            <FormGroup>
                <h5>Confirm Redeem Request</h5>
                <p>Please verify and confirm your redeem request.</p>
                <Row className="justify-content-md-center">
                    <Col md="auto" className="text-left">
                        <FormGroup>
                            <ListGroup>
                                <ListGroupItem>Burning: <strong>{this.props.amountPolkaBTC} PolkaBTC</strong></ListGroupItem>
                                <ListGroupItem>Your Bitcoin address: <strong>{this.props.userBTCAddress}</strong></ListGroupItem>
                                <ListGroupItem>Receiving: <strong>{this.props.amountPolkaBTC} BTC</strong></ListGroupItem>
                            </ListGroup>
                        </FormGroup>
                    </Col>
                </Row>
            </FormGroup>
        )
    }
}


class VaultInfo extends Component<RedeemWizardProps, {}> {
    render() {
        console.log(this.props.step);
        if (this.props.step !== 4) {
            return null
        }
        return (
            <FormGroup>
                <h5>Request being processed...</h5>
                <Row className="justify-content-md-center">
                    <Col md="auto" className="text-left">

                        <FormGroup>
                            <ListGroup>
                                Your redeem request is being processed by Vault
              <b>{shortAddress(this.props.vaultDOTAddress)}</b>
                                <br />
                                <br />
            You will receive BTC from the following Bitcoin address: <b>{this.props.vaultBTCAddress}</b>
                            </ListGroup>
                        </FormGroup>
                        <br />
                        <p>We will inform you when your redeem request has been executed.</p>
                    </Col>
                </Row>
            </FormGroup>
        )
    }
}
