import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Image, Button, Col, Row, Modal } from 'react-bootstrap';

import AppState from '../types/AppState';
import { RedeemProps, RedeemRequest } from '../types/RedeemState';
import RedeemWizard from '../components/RedeemWizard';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
import RedeemRequests from '../components/RedeemRequests';
import { ALICE_BTC, BOB_BTC } from '../constants';

export default class RedeemPage extends Component<AppState, RedeemProps> {
  state: RedeemProps = {
    balancePolkaBTC: "",
    balanceDOT: "loading...",
    redeemRequests: [],
    showWizard: false,
    idCounter: 0,
    storage: this.props.storage,
    kvstorage: this.props.kvstorage,
  }

  // constructor(props: AppState & RouteComponentProps) {
  constructor(props: AppState) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addRedeemRequest = this.addRedeemRequest.bind(this);
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
      const balancePolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.address);
      const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.address);
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
        redeemRequests: this.props.storage.redeemRequests,
        idCounter: 3
      })
    }
  }

  addRedeemRequest(req: RedeemRequest) {
    let arr = this.state.redeemRequests;
    req.id = this.getAndIncrementIdCounter().toString();
    this.setState({
      balancePolkaBTC: (parseFloat(this.state.balancePolkaBTC) - parseFloat(req.amount)).toString()
    })
    arr.push(req);
    this.setState({
      redeemRequests: arr,
    })
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
                <Button variant="outline-dark" size="lg" block onClick={this.handleShow}>Redeem PolkaBTC</Button>
              </Col>
            </Row>

            <RedeemRequests {...this.state} />


            <Modal show={this.state.showWizard} onHide={this.handleClose}>
              <RedeemWizard {...this.state} handleClose={this.handleClose} addRedeemRequest={this.addRedeemRequest}/>
            </Modal>
          </div>
        </section>
      </div>
    )
  }
}
