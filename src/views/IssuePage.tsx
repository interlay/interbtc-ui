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
    idCounter: 0,
    storage: this.props.storage,
    kvstorage: this.props.kvstorage,
    addIssueRequest: () => {},
  }

  // constructor(props: AppState & RouteComponentProps) {
  constructor(props: AppState) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addIssueRequest = this.addIssueRequest.bind(this);
    this.state.balancePolkaBTC = this.props.kvstorage.getValue("balancePolkaBTC");
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
    if (this.props.parachain.api && this.props.address) {
      // const balancePolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.address);
      // const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.address);
      this.setState({
        balancePolkaBTC: this.props.kvstorage.getValue("balancePolkaBTC"),
        balanceDOT: this.props.kvstorage.getValue("balanceDOT")
      });
    }
  }

  componentDidMount() {
    this.getParachainData();

    if (this.props.storage) {
      this.setState({
        issueRequests: this.props.storage.issueRequests,
        idCounter: 3
      })
    }
  }

  addIssueRequest(req: IssueRequest) {
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
    let counter = this.state.idCounter;
    this.setState({
      idCounter:  counter + 1,
    })
    this.props.storage?.appendIssueRequest(req);
    this.handleClose();
  }

  getAndIncrementIdCounter() {
    let ret = this.state.idCounter;
    this.state.idCounter++;
    return ret;
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
              <IssueWizard {...this.state} addIssueRequest={this.addIssueRequest}/>
            </Modal>

          </div>
        </section>
      </div>
    )
  }
}

// export default withRouter(IssuePage);
export default IssuePage;
