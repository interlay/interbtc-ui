import React, { Component, FormEvent, ChangeEvent } from "react";
import { IssueProps, IssueRequest } from "../../types/IssueState";
import { Container, Modal, Form } from "react-bootstrap";
import RequestConfirmation from "./request-confirmation";
import EnterBTCAmount from "./enter-btc-amount";
import BTCPayment from "./btc-payment";
import Confirmation from "./confirmation";

export interface IssueWizardProps {
    step: number,
    issueId: string,
    amountBTC: string,
    vaultBTCAddress: string,
    amountPolkaBTC: string,
    transactionBTC: string,
    feeBTC: string,
    btcTxId: string,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default class IssueWizard extends Component<IssueProps, IssueWizardProps> {
    state: IssueWizardProps = {
        step: 1,
        issueId: "",
        amountBTC: "0",
        vaultBTCAddress: "",
        amountPolkaBTC: "0.01",
        transactionBTC: "",
        feeBTC: "", // TODO: get this from the BTC-Parachain
        btcTxId: "",
        handleChange: () => { },
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
        step = step >= 4 ? 5 : step + 1;
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
        const { amountBTC } = this.state;
        let valid = [
            parseFloat(amountBTC) > 0,
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
        const buttontext = (step === 2) ? ("Confirm") : ("Next");
        if (step < 5) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={() => this._next()}>
                    { buttontext}
                </button>
            )
        }
        return null;
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        let { name, value } = event.target;
        if (name === "vaultBTCAddress") {
            this.setState({
                vaultBTCAddress: value,
            });
        } else {
            this.setState({
                ...this.state,
                [name]: value
            });
            if (name === "amountBTC") {
                this.setState({
                    amountPolkaBTC: value,
                    feeBTC: (Number.parseFloat(value) * 0.005).toString()
                })
            }
        }



    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let date: Date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        let req: IssueRequest = {
            id: this.props.idCounter.toString(),
            amountBTC: this.state.amountBTC,
            creation: date.toISOString(),
            vaultBTCAddress: this.state.vaultBTCAddress,
            btcTxId: "...",
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
                        <RequestConfirmation {...this.state} />
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
