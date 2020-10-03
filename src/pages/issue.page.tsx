import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row } from "react-bootstrap";

import AppState from "../common/types/app.types";
import { IssueProps, IssueRequest } from "../common/types/issue.types";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";
import IssueRequests from "../common/components/issue/issue-requests";

// class IssuePage extends Component<AppState & RouteComponentProps, IssueProps> {
class IssuePage extends Component<AppState, IssueProps> {
    state: IssueProps = {
        balancePolkaBTC: "loading...",
        balanceDOT: "loading...",
        issueRequests: [],
        lastissueRequestsUpdate: new Date(),
        showWizard: false,
        idCounter: 0,
    };

    // constructor(props: AppState & RouteComponentProps) {
    constructor(props: AppState) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addIssueRequest = this.addIssueRequest.bind(this);
        // TODO: get from storage
        this.state.balancePolkaBTC = "20";
    }

    handleShow(): void {
        this.setState({
            showWizard: true,
        });
    }

    handleClose(): void {
        this.setState({
            showWizard: false,
        });
    }

    async getParachainData(): Promise<void> {
        // const balancePolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.address);
        // const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.address);
        this.setState({
            // TODO: get from storage
            balancePolkaBTC: "20",
            balanceDOT: "20",
        });
    }

    componentDidMount(): void {
        this.getParachainData();

        this.setState({
            // TODO: get from storage
            issueRequests: [],
            idCounter: 3,
        });
    }

    addIssueRequest(req: IssueRequest): void {
        // let arr = this.state.issueRequests;
        // req.id = this.getAndIncrementIdCounter().toString();
        /*
      // Actually, we should only increment the balance once the issue request is finalized.
      this.setState({
        balancePolkaBTC: (parseFloat(this.state.balancePolkaBTC) + parseFloat(req.amount)).toString()
      })
      */
        // arr.push(req);
        // this.setState({
        //   issueRequests: arr,
        // })
        // console.log("appending issueRequest");
        // console.log(req);
        // console.log(this.props.storage?.issueRequests);
        const counter = this.state.idCounter;
        this.setState({
            idCounter: counter + 1,
        });
        // eslint-disable-next-line
        // TODO: store issue request
        // this.props.storage?.appendIssueRequest(req);
        this.handleClose();
    }

    handleUpdatedIssueRequests(updatedIssueRequests: Array<IssueRequest>): void {
        this.setState({
            ...this.state,
            issueRequests: updatedIssueRequests,
        });
    }

    render(): JSX.Element {
        const balancePolkaBTC = this.state.balancePolkaBTC;
        const balanceDOT = this.state.balanceDOT;
        return (
            <div>
                <section className="jumbotron text-center white-background mt-2">
                    <div className="container mt-5">
                        <Link to="/">
                            <Image src={PolkaBTCImg} width="256"></Image>
                        </Link>

                        <Row className="mt-5">
                            <Col xs="12" sm={{ span: 6, offset: 3 }}>
                                <h5 className="text-muted">PolkaBTC balance: {balancePolkaBTC}</h5>
                            </Col>
                        </Row>
                        <Row className="mt-1">
                            <Col xs="12" sm={{ span: 6, offset: 3 }}>
                                <h5 className="text-muted">DOT balance: {balanceDOT}</h5>
                            </Col>
                        </Row>
                        <Row className="mt-5 mb-5">
                            <Col className="mt-2" xs="12" sm={{ span: 4, offset: 4 }}>
                                <Button variant="outline-dark" size="lg" block onClick={this.handleShow}>
                                    Issue PolkaBTC
                                </Button>
                            </Col>
                        </Row>

                        <IssueRequests {...this.state} />

                        {/* <Modal show={this.state.showWizard} onHide={this.handleClose}>
                            <IssueWizard {...this.state} addIssueRequest={this.addIssueRequest} />
                        </Modal> */}
                    </div>
                </section>
            </div>
        );
    }
}

// export default withRouter(IssuePage);
export default IssuePage;
