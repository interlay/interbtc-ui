import React, { Component } from 'react';
import { withRouter, NavLink, RouteComponentProps, Link } from 'react-router-dom';
import { Image, Button, Col, Row } from 'react-bootstrap';

import AppState from '../types/AppState';
import LandingProps from '../types/LandingState';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
// import overviewImg from '../assets/img/overview.png';
// import CbAImg from '../assets/img/CbA.png';

// class LandingPage extends Component<AppState & RouteComponentProps, LandingProps> {
class LandingPage extends Component<AppState, LandingProps> {
  state: LandingProps = {
    totalPolkaBTC: "loading...",
    totalLockedDOT: "loading..."
  }

  // constructor(props: AppState & RouteComponentProps) {
  constructor(props: AppState) {
    super(props);
  }

  async getParachainData() {
    // FIXME: only update when the issuance is actually updated
    if (!this.props.parachain.api) {
      await this.props.parachain.connect();
    }
    if (this.props.parachain.api) {
      const totalPolkaBTC = await this.props.parachain.getTotalPolkaBTC();
      const totalLockedDOT = await this.props.parachain.getTotalLockedDOT();
      const totalDOT = await this.props.parachain.getTotalDOT();
      this.setState({
        totalPolkaBTC: totalPolkaBTC,
        totalLockedDOT: totalLockedDOT
      });
    }
  }

  componentDidMount() {
    this.getParachainData();
  }

  render() {
    const totalPolkaBTC = this.state.totalPolkaBTC;
    const totalLockedDOT = this.state.totalLockedDOT;
    return (
      <div>
        <section className="jumbotron min-vh-100 text-center white-background mt-2">
          <div className="container mt-5">
          <Link to="/"><Image src={ PolkaBTCImg } width='256'></Image></Link>
            <h3 style={{ fontSize: "1.5em" }}className="lead mt-3"></h3>
            <h3 style={{ fontSize: "1.5em" }}className="lead text-muted mt-3">PolkaBTC: Trustless and open DeFi access for your Bitcoin.</h3>

            <Row className="mt-5">
              <Col xs="12" sm={{span: 6, offset: 3}}>
                <h5 className="text-muted">PolkaBTC issued: { totalPolkaBTC }</h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col xs="12" sm={{span: 6, offset: 3}}>
                <h5 className="text-muted">DOT locked: { totalLockedDOT }</h5>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/"><Button variant="outline-primary" size="lg" block>Buy PolkaBTC</Button></NavLink>
              </Col>
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/issue"><Button variant="outline-dark" size="lg" block>Mint PolkaBTC</Button></NavLink>
              </Col>
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/redeem"><Button variant="outline-primary" size="lg" block>Redeem PolkaBTC</Button></NavLink>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    )
  }
}

// export default withRouter(LandingPage);
export default LandingPage;

//         <section>
//           <div className="container mt-5">
//             <h1>Trustless assets</h1>
//             <Row className="mt-5">
//               <Col className="mt-5">
//                 <Image src={ CbAImg } fluid></Image>
//               </Col>
//             </Row>
//           </div>
//         </section>
//         <section>
//           <div className="container mt-5">
//             <h1>Decentralized Bitcoin Bridge</h1>
//             <Row className="mt-5">
//               <Col className="mt-5">
//                 <Image src={ overviewImg } fluid></Image>
//               </Col>
//             </Row>
//           </div>
//         </section>
