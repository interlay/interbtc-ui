import React, { Component, ChangeEvent } from 'react';
import { withRouter, RouteComponentProps, Link} from 'react-router-dom';
import { Image, Button, Col, Row, Modal } from 'react-bootstrap';

import AppState from '../types/AppState';
import { IssueProps, IssueRequest } from '../types/IssueState';
import IssueWizard from '../components/IssueWizard';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
import IssueRequests from '../components/IssueRequests';

// class IssuePage extends Component<AppState & RouteComponentProps, IssueProps> {
class IssuePage extends Component<AppState, IssueProps> {
  state: IssueProps = {
    balancePolkaBTC: "loading...",
    balanceDOT: "loading...",
    issueRequests: [],
    showWizard: false,
  }

  // constructor(props: AppState & RouteComponentProps) {
  constructor(props: AppState) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addIssueRequest = this.addIssueRequest.bind(this);
  }

  handleShow(event: React.MouseEvent<HTMLElement>) {
    this.setState({
      showWizard: true
    })
  }

  handleClose() {
    this.setState({
      showWizard: false
    })
  }

  async getParachainData() {
    if (!this.props.parachain.api) {
      await this.props.parachain.connect();
    }
    if (this.props.parachain.api && this.props.account) {
      const balancePolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.account);
      const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.account);
      this.setState({
        balancePolkaBTC: balancePolkaBTC,
        balanceDOT: balanceDOT
      });
    }
  }

  componentDidMount() {
    this.getParachainData();

    this.setState({
      issueRequests: [
        {
          id: "1",
          amount: "0.5 PolkaBTC",
          creation: "21 Jun 2020 19:08",
          vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
          btcTx: "3b4162a307fab...b588d61a9069e762",
          confirmations: 6
        },
        {
          id: "2",
          amount: "0.2 PolkaBTC",
          creation: "21 Jun 2020 21:08",
          vaultAddress: "aa269f4bd72bd...7d10a62a9cdd8d7f",
          btcTx: "d3c6652dfa406...e4aacb4c441e030e",
          confirmations: 1
        }
      ]
    })
  }

  addIssueRequest(req: IssueRequest) {
    let arr = this.state.issueRequests;
    arr.push(req);
    this.setState({
      issueRequests: arr,
    })
  }

  render() {
    const balancePolkaBTC = this.state.balancePolkaBTC;
    const balanceDOT = this.state.balanceDOT;
    return (
      <div>
        <section className="jumbotron text-center white-background mt-2">
          <div className="container mt-5">
            <Link to="/"><Image src={ PolkaBTCImg } width='256'></Image></Link>

            <Row className="mt-5">
              <Col xs="12" sm={{span: 6, offset: 3}}>
                <h5 className="text-muted">PolkaBTC balance: { balancePolkaBTC }</h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col xs="12" sm={{span: 6, offset: 3}}>
                <h5 className="text-muted">DOT balance: { balanceDOT }</h5>
              </Col>
            </Row>
            <Row className="mt-5 mb-5">
              <Col className="mt-2" xs="12" sm={{ span: 4, offset: 4 }}>
                <Button variant="outline-dark" size="lg" block onClick={this.handleShow}>Request PolkaBTC</Button>
              </Col>
            </Row>

            <IssueRequests {...this.state} />

            <Modal show={this.state.showWizard} onHide={this.handleClose}>
              <IssueWizard {...this.state} handleClose={this.handleClose}/>
            </Modal>

          </div>
        </section>
      </div>
    )
  }
}

// export default withRouter(IssuePage);
export default IssuePage;
