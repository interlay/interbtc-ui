import React, { Component, ChangeEvent } from 'react';
import { withRouter, NavLink, RouteComponentProps } from 'react-router-dom';
import { Image, Button, Col, Row, Modal } from 'react-bootstrap';

import AppState from '../types/AppState';
import { IssueProps, IssueRequest } from '../types/IssueState';
import IssueWizard from '../components/IssueWizard';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';

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
  }

  handleShow(event: React.MouseEvent<HTMLElement>) {
    this.setState({
      showWizard: true
    })
  }

  handleClose(event: React.MouseEvent<HTMLElement>) {
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
  }

  render() {
    const balancePolkaBTC = this.state.balancePolkaBTC;
    const balanceDOT = this.state.balanceDOT;
    return (
      <div>
        <section className="jumbotron text-center white-background mt-2">
          <div className="container mt-5">
            <Image src={ PolkaBTCImg } width='256'></Image>

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
            <Row className="mt-5">
              <Col className="mt-2" xs="12" sm={{ span: 4, offset: 4 }}>
                <Button variant="outline-dark" size="lg" block onClick={this.handleShow}>Request PolkaBTC</Button>
              </Col>
            </Row>
            <Modal show={this.state.showWizard} onHide={this.handleClose}>
              <IssueWizard {...this.state} />
            </Modal>

          </div>
        </section>
      </div>
    )
  }
}

// export default withRouter(IssuePage);
export default IssuePage;
