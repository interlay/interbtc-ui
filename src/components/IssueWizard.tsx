import React, { Component, FormEvent, ChangeEvent } from "react";
import { BOB_BTC } from "../constants";
import { IssueProps } from "../types/IssueState";
import { Container, Modal, Form, FormGroup, FormControl, ListGroup, ListGroupItem, Row, Col } from "react-bootstrap";
import QRCode from "qrcode.react";

interface IssueWizardProps {
  step: number,
  issueId: string,
  amountBTC: string,
  vaultBTCAddress: string,
  amountPolkaBTC: string,
  transactionBTC: string,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default class IssueWizard extends Component<IssueProps, IssueWizardProps> {
  state: IssueWizardProps = {
    step: 1,
    issueId: "",
    amountBTC: "0",
    vaultBTCAddress: BOB_BTC,
    amountPolkaBTC: "0",
    transactionBTC: "",
    handleChange: () => {},
  }

  constructor(props: IssueProps) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.state.handleChange = this.handleChange.bind(this);
  }

  _next() {
    let step = this.state.step;
    if (this.isValid(step - 1)) return;
    // If the current step is 1 or 2, then add one on "next" button click
    step = step >= 2 ? 3 : step + 1;
    this.setState({
        step: step
    })
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
    if (step === 0) {
        return false;
    }
    return true;
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


  }

  render() {
    return (
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Request PolkaBTC
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <EnterBTCAmount {...this.state} />
            <BTCPayment {...this.state} />
            <Confirmation {...this.state} />
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

class EnterBTCAmount extends Component<IssueWizardProps, EnterBTCAmountProps> {
  state: EnterBTCAmountProps = {
    amountBTC: this.props.amountBTC
  }

  constructor(props: IssueWizardProps) {
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
        <p>How much BTC to you want to receive in PolkaBTC?</p>
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

interface BTCPaymentProps {
  paymentUri: string,
  loaded: boolean,
}

class BTCPayment extends Component<IssueWizardProps, BTCPaymentProps> {
  state: BTCPaymentProps = {
    paymentUri: '',
    loaded: false
  }

  constructor(props: IssueWizardProps) {
    super(props);
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
    console.log(this.props.step);
    if (this.props.step !== 2) {
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
                <ListGroupItem>Sending: <strong>{this.props.amountBTC} BTC</strong></ListGroupItem>
                <ListGroupItem>Vault address: <strong>{this.props.vaultBTCAddress}</strong></ListGroupItem>
                <ListGroupItem>Receiving: <strong>{this.props.amountBTC} PolkaBTC</strong></ListGroupItem>
              </ListGroup>
          </FormGroup>
      </FormGroup>
    )
  }
}

class Confirmation extends Component<IssueWizardProps, {}> {
  constructor(props: IssueWizardProps) {
    super(props);
  }

  render() {
    console.log(this.props.step);
    if (this.props.step !== 3) {
      return null
    }
    return (
      <FormGroup>
        <h5>Confirmation</h5>
          <Row className="justify-content-md-center">
            <Col md="auto" className="text-center">
                <p>
                  We will monitor your Bitcoin transaction for you and notify you when the transaction has enough confirmations. You can then complete the process. Depending on the block times and the utilization of the Bitcoin network, this process might take an hour.
                </p>
            </Col>
        </Row>
      </FormGroup>
    )
  }
}
