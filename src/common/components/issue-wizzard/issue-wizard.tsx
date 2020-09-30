import React, { Component, FormEvent, ChangeEvent } from "react";
import { BOB_BTC } from "../../../constants";
import { IssueProps, IssueRequest } from "../../types/IssueState";
import { Container, Modal, Form } from "react-bootstrap";
import EnterBTCAmount from "./enter-btc-amount";
import BTCPayment from "./btc-payment";
import Confirmation from "./confirmation";

export interface IssueWizardProps {
  step: number,
  issueId: string,
  vaultBTCAddress: string,
  amountPolkaBTC: string,
  transactionBTC: string,
  feeBTC: string,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
  minIssueAmount: string
}

export default class IssueWizard extends Component<IssueProps, IssueWizardProps> {
  state: IssueWizardProps = {
    step: 1,
    issueId: "",
    vaultBTCAddress: BOB_BTC,
    amountPolkaBTC: "0.01", // TODO: set default to minIssueAmount
    transactionBTC: "",
    handleChange: () => {},
    minIssueAmount: "0.01",// TODO: get this from BTC-Parachain/polkadot-js lib
    feeBTC: "0.00005",// TODO: get this from BTC-Parachain/polkadot-js lib
  }

  constructor(props: IssueProps &
    { addIssueRequest: (req: IssueRequest) => void; }
    ) {
    super(props);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.state.handleChange = this.handleChange.bind(this);
  }

  _next() {
    let step = this.state.step;
    if (!this.isValid(step - 1)) return;
    // If the current step is 1 or 2, then add one on "next" button click
    step = step >= 3 ? 4 : step + 1;
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
    const {amountPolkaBTC} = this.state;
    let valid = [
      parseFloat(amountPolkaBTC) > 0,
      true,
      true,
    ]
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
      let buttontext = "";
      switch (step) {
        case 1: buttontext = "Mint  " + this.state.amountPolkaBTC + " PolkaBTC";
        case 2: buttontext = "I have made the Bitcoin payment";
        case 3: buttontext = "Submit";
        default: buttontext = "Next";
      }
      if (step < 3) {
          return (
              <button
                  className="btn btn-primary float-right"
                  type="button" onClick={() => this._next()}>
                  { buttontext }
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
    if (name === "amountPolkaBTC") {
      this.setState({
        amountPolkaBTC: value,
        // TODO: replace this with polkabtc-js call to avoid JS rounding errors (request directly from BTC-Parachain so we have the exact amount)
        feeBTC: value ? Number((Number.parseFloat(value) * 0.005).toFixed(8)).toString() : "0"
      })
    }
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let date: Date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    let req: IssueRequest = {
      id: this.props.idCounter.toString(),
      amount: this.state.amountPolkaBTC,
      creation: date.toISOString(),
      vaultAddress: this.state.vaultBTCAddress,
      btcTx: "...",
      confirmations: 0,
      completed: false
    }
    this.props.addIssueRequest(req);
  }

  render() {
    return (
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Issue PolkaBTC
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



