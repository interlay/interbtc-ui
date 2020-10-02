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
    vaultId: string,
    transactionBTC: string,
    feeBTC: string,
    btcTxId: string,
    issueRequestHash: string,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default class IssueWizard extends Component<IssueProps, IssueWizardProps> {
    state: IssueWizardProps = {
        step: 1,
        issueId: "",
        amountBTC: "0",
        vaultBTCAddress: "",
        vaultId: "",
        transactionBTC: "",
        feeBTC: "", // TODO: get this from the BTC-Parachain
        btcTxId: "",
        issueRequestHash: "loading...",
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
        step = step >= 3 ? 4 : step + 1;
        this.setState({
            step: step
        });
    }

    _prev() {
        let step = this.state.step;
        // If the current step is 2 or 3, then subtract one on "previous" button click
        step = step <= 1 ? 1 : step - 1;
        this.setState({
            step: step
        });
    }

    isValid(step: number) {
        const { amountBTC } = this.state;
        const valid = [
            parseFloat(amountBTC) > 0, // TODO: add that we need to have found a vault for the amount
            true,
            true,
        ];
        return valid[step];
    }

    get previousButton() {
        const step = this.state.step;
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
        const step = this.state.step;
        const buttontext = (step === 2) ? ("Confirm") : ("Next");
        if (step < 4) {
            return (
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={() => this._next()}>
                    { buttontext}
                </button>
            );
        }
        return null;
    }

    handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        this.setState({
            ...this.state,
            [name]: value
        });
        if (name === "amountBTC") {
            this.setState({
                amountBTC: value,
                feeBTC: (Number(value) ? Number.parseFloat(value) * 0.005 : 0).toString()
            });
        }
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const date: Date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        const req: IssueRequest = {
            id: this.props.idCounter.toString(),
            amountBTC: this.state.amountBTC,
            creation: date.toISOString(),
            vaultBTCAddress: this.state.vaultBTCAddress,
            btcTxId: this.state.btcTxId,
            confirmations: 0,
            completed: false
        };
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
        );
    }
}
