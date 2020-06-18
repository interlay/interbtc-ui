import React, { Component, FormEvent, ChangeEvent } from "react";
import { BOB_BTC, ALICE, ALICE_BTC } from "../constants";
import { RedeemProps, RedeemRequest } from "../types/RedeemState";
import { Container, Modal, Form, FormGroup, FormControl, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import QRCode from "qrcode.react";
import RedeemRequests from "./RedeemRequests";

interface RedeemWizardProps {
  step: number,
  redeemId: string,
  amountBTC: string,
  creation: string,
  btcAddress: string,
  vaultDOTAddress: string,
  vaultBTCAddress: string,
  btcTx: string,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
  balancePolkaBTC: string
}

export default class RedeemWizard extends Component<RedeemProps  & { handleClose: () => void; } & { addRedeemRequest: (req: RedeemRequest) => void; }, RedeemWizardProps> {
  state: RedeemWizardProps = {
    step: 1,
    redeemId: "3",
    amountBTC: "0",
    creation: "",
    btcAddress: BOB_BTC,
    vaultDOTAddress: ALICE,
    vaultBTCAddress: ALICE_BTC,
    btcTx: "...",
    handleChange: () => {},
    balancePolkaBTC: ""
  }

  constructor(props: RedeemProps &  
    { handleClose: () => void; } & 
    { addRedeemRequest: (req: RedeemRequest) => void; }
    ) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.state.handleChange = this.handleChange.bind(this);
    this.state.balancePolkaBTC = this.props.balancePolkaBTC;
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
    const {amountBTC} = this.state;
    let valid = [
      parseFloat(amountBTC) > 0 && parseFloat(amountBTC) <= parseFloat(this.props.balancePolkaBTC),
      true,
      true]
    return valid[step];
  }

  get previousButton() {
      let step = this.state.step;
      if (step > 1 && step < 4) {
          return (
              <button
                  className="btn btn-secondary float-left"
                  type="button" onClick={() => this._prev()}>
                  Previous
              </button>
          )
      } else if(step == 4) {
        return (
          <button
              className="btn btn-primary float-right"
              type="button" onClick={() => this.closeModal()}>
              Close
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
      } else if (step == 3) {
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

  confirmRedeem = async () => {
    //TODO: call setter in RedeemPage
    let date: Date = new Date();  
    this.props.addRedeemRequest({
      id: this.state.redeemId,
      amount: this.state.amountBTC,
      creation: date.toLocaleString(),
      vaultAddress: this.state.vaultDOTAddress,
      vaultBTCAddress: this.state.vaultBTCAddress,
      redeemAddress: this.state.btcAddress,
      btcTx: "",
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
            <EnterBTCAmount {...this.state} />
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
  amountBTC: string
}

class EnterBTCAmount extends Component<RedeemWizardProps, EnterBTCAmountProps> {
  state: EnterBTCAmountProps = {
    amountBTC: this.props.amountBTC
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
    return(
      <FormGroup>
        <p>How much PolkaBTC do you want to redeem for BTC?</p>
        <p>You have {this.props.balancePolkaBTC} PolkaBTC</p>
        <FormControl
          id="amountBTC"
          name="amountBTC"
          type="string"
          value={this.props.amountBTC}
          onChange={this.props.handleChange}
        />
      </FormGroup>
    )
  }
}


interface EnterBTCAddressProps {
  amountBTC: string
}

class EnterBTCAddress extends Component<RedeemWizardProps, EnterBTCAddressProps> {
  state: EnterBTCAddressProps = {
    amountBTC: this.props.amountBTC
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
    return(
      <FormGroup>
        <p>Please enter your Bitcoin address</p>
        <FormControl
          id="btcAddress"
          name="btcAddress"
          type="string"
          value={this.props.btcAddress}
          onChange={this.props.handleChange}
        />
      </FormGroup>
    )
  }
}


class Confirmation extends Component<RedeemWizardProps, {}> {
  constructor(props: RedeemWizardProps) {
    super(props);
  }

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
                <ListGroupItem>Burning: <strong>{this.props.amountBTC} PolkaBTC</strong></ListGroupItem>
                <ListGroupItem>Your Bitcoin address: <strong>{this.props.btcAddress}</strong></ListGroupItem>
                <ListGroupItem>Receiving: <strong>{this.props.amountBTC} BTC</strong></ListGroupItem>
              </ListGroup>
          </FormGroup>
          </Col>
        </Row>
      </FormGroup>
    )
  }
}


class VaultInfo extends Component<RedeemWizardProps, {}> {
  constructor(props: RedeemWizardProps) {
    super(props);
  }

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
              <strong>{this.props.vaultDOTAddress}</strong>
            <br/>
            <br/>
            You will receive BTC from the following Bitcoin address: <strong>{this.props.vaultBTCAddress}</strong>
              </ListGroup>
          </FormGroup>
          <br/>
          <p>We will inform you when your redeem request has been executed.</p>
            </Col>
        </Row>
      </FormGroup>
    )
  }
}