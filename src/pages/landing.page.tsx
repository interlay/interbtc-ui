import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { Image, Button, Col, Row } from "react-bootstrap";
import { PolkaBTCAPI } from "@interlay/polkabtc/src";
import { createAPI } from "@interlay/polkabtc/src/factory";

import AppState from "../common/types/AppState";
import LandingProps from "../common/types/LandingState";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";

// class LandingPage extends Component<AppState & RouteComponentProps, LandingProps> {
class LandingPage extends Component<AppState, LandingProps> {
  state: LandingProps = {
      totalPolkaBTC: "loading...",
      totalLockedDOT: "loading...",
  };

  async getParachainData(): Promise<void> {

    const defaultEndpoint = "ws://127.0.0.1:9944";
    const api = await createAPI(defaultEndpoint);
    const polkaBTC = new PolkaBTCAPI(api);
    // await api.query.dot.account(accountId)
      // FIXME: only update when the issuance is actually updated
      if (!this.props.parachain.api) {
          await this.props.parachain.connect();
      }
      // if (this.props.parachain.api) {
      //   const totalPolkaBTC = await this.props.parachain.getTotalPolkaBTC();
      //   const totalLockedDOT = await this.props.parachain.getTotalLockedDOT();
      //   const totalDOT = await this.props.parachain.getTotalDOT();
      //   this.setState({
      //     totalPolkaBTC: totalPolkaBTC,
      //     totalLockedDOT: totalLockedDOT
      //   });
      // }
      this.setState({
          totalPolkaBTC: this.props.kvstorage.getValue("totalPolkaBTC"),
          totalLockedDOT: this.props.kvstorage.getValue("totalLockedDOT"),
      });
  }

  componentDidMount(): void {
      this.getParachainData();
  }

  render(): JSX.Element {
      const totalPolkaBTC = this.state.totalPolkaBTC;
      const totalLockedDOT = this.state.totalLockedDOT;
      return (
          <div>
              <section className="jumbotron min-vh-100 text-center white-background mt-2">
                  <div className="container mt-5">
                      <Link to="/">
                          <Image src={PolkaBTCImg} width="256"></Image>
                      </Link>
                      <h3 style={{ fontSize: "1.5em" }} className="lead text-muted mt-3">
              PolkaBTC: Trustless and open DeFi access for your Bitcoin.
                      </h3>

                      <Row className="mt-5">
                          <Col xs="12" sm={{ span: 6, offset: 3 }}>
                              <h5 className="text-muted">PolkaBTC issued: {totalPolkaBTC}</h5>
                          </Col>
                      </Row>
                      <Row className="mt-1">
                          <Col xs="12" sm={{ span: 6, offset: 3 }}>
                              <h5 className="text-muted">DOT locked: {totalLockedDOT}</h5>
                          </Col>
                      </Row>
                      <Row className="mt-5">
                          <Col className="mt-2" xs="12" sm={{ span: 4, offset: 2 }}>
                              <NavLink className="text-decoration-none" to="/issue">
                                  <Button variant="outline-dark" size="lg" block>
                    Issue PolkaBTC
                                  </Button>
                              </NavLink>
                          </Col>
                          <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                              <NavLink className="text-decoration-none" to="/redeem">
                                  <Button variant="outline-primary" size="lg" block>
                    Redeem PolkaBTC
                                  </Button>
                              </NavLink>
                          </Col>
                      </Row>
                  </div>
              </section>
          </div>
      );
  }
}

// export default withRouter(LandingPage);
export default LandingPage;
