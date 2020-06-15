import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Image, Container, Button, Col, Row } from 'react-bootstrap';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
import overviewImg from '../assets/img/overview.png';
import CbAImg from '../assets/img/CbA.png';


export default class LandingPage extends Component {
  render() {
    return (
      <div>
        <section className="jumbotron min-vh-100 text-center white-background mt-2">
          <div className="container mt-5">
            <Image src={ PolkaBTCImg } width='256'></Image>
            <h3 style={{ fontSize: "1.5em" }}className="lead mt-3"></h3>
            <h3 style={{ fontSize: "1.5em" }}className="lead text-muted mt-3">DeFi access for your Bitcoin. Trustless and open.</h3>

            <Row className="mt-5">
              <Col xs="12" sm={{span: 4, offset: 4}}>
                <h5 className="text-muted">PolkaBTC issued: 12.4</h5>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col xs="12" sm={{span: 4, offset: 4}}>
                <h5 className="text-muted">DOT locked: 35.1</h5>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/trade"><Button variant="outline-primary" size="lg" block>Buy PolkaBTC</Button></NavLink>
              </Col>
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/help"><Button variant="outline-dark" size="lg" block>Mint PolkaBTC</Button></NavLink>
              </Col>
              <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                <NavLink className="text-decoration-none" to="/trade"><Button variant="outline-primary" size="lg" block>Return BTC</Button></NavLink>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    )
  }
}


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