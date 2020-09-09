import React, { Component } from "react";
import { Image, Col, Row, Table } from "react-bootstrap";

import AppState from "../common/types/AppState";
import { VaultProps } from "../common/types/VaultState";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";
import { Vault } from "../common/controllers/Vault";

export default class VaultPage extends Component<AppState, VaultProps> {
  state: VaultProps = {
      balanceDOT: "loading...",
      balanceLockedDOT: "loading...",
      backedPolkaBTC: "loading...",
      collateralRate: "loading...",
      feesEarned: "loading...",
      redeems: [],
  }

  async componentDidMount() {
      await this.getParachainData();
      const vault = new Vault();
      const result = await vault.getRedeems();

      this.setState({
          redeems: result,
      });
  }

  async getParachainData() {
      if (!this.props.parachain.api) {
          await this.props.parachain.connect();
      }
      if (this.props.parachain.api && this.props.address) {
          const backedPolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.address);
          const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.address);
          const balanceLockedDOT = await this.props.parachain.getBalanceDOT(this.props.address);
          this.setState({
              balanceDOT: this.props.kvstorage.getValue("balanceDOT"),
              balanceLockedDOT: this.props.kvstorage.getValue("balanceLockedDOT"),
              backedPolkaBTC: this.props.kvstorage.getValue("backedPolkaBTC"),
              collateralRate: this.props.kvstorage.getValue("collateralRate"),
              feesEarned: this.props.kvstorage.getValue("feesEarned"),
          });
      }
  }

  renderTableData() {
      return this.state.redeems.map((redeem) => {
          return (
              <tr key={redeem.id}>
                  <td>{redeem.id.substring(0, 10)}...{redeem.id.substring(50)}</td>
                  <td>{redeem.amount}</td>
                  <td>{redeem.creation}</td>
                  <td>{redeem.tx_id.substring(0, 10)}...{redeem.tx_id.substring(50)}</td>
                  <td>{redeem.confirmations}</td>
                  <td>No</td>
              </tr>
          );
      });
  }

  render() {
      const { balanceDOT
          , balanceLockedDOT
          , backedPolkaBTC
          , collateralRate
          , feesEarned
          , redeems
      } = this.state;
      return (
          <div>
              <section className="jumbotron text-center white-background mt-2">
                  <div className="container mt-5">
                      <Image src={ PolkaBTCImg } width='256'></Image>

                      <Row className="mt-5">
                          <Col xs="12" sm={{span: 4, offset: 2}}>
                              <h5 className="text-muted">DOT balance: { balanceDOT }</h5>
                          </Col>
                          <Col xs="12" sm={{span: 4 }}>
                              <h5 className="text-muted">Locked DOT balance: { balanceLockedDOT }</h5>
                          </Col>
                      </Row>
                      <Row className="mt-5">
                          <Col xs="12" sm={{span: 4, offset: 2}}>
                              <h5 className="text-muted">PolkaBTC backed: { backedPolkaBTC }</h5>
                          </Col>
                          <Col xs="12" sm={{span: 4 }}>
                              <h5 className="text-muted">Collateral rate: { collateralRate }%</h5>
                          </Col>
                      </Row>
                      <Row className="mt-5">
                          <Col xs="12" sm={{span: 6, offset: 3}}>
                              <h5 className="text-muted">Fees earned: { feesEarned } PolkaBTC</h5>
                          </Col>
                      </Row>

                      <Table className="mt-5" hover responsive size={"md"}>
                          <thead>
                              <tr>
                                  <th>Redeem ID</th>
                                  <th>Amount</th>
                                  <th>Creation Date</th>
                                  <th>TxID</th>
                                  <th>Confirmations</th>
                                  <th>Complete</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.renderTableData()}
                          </tbody>
                      </Table>

                  </div>
              </section>
          </div>
      );
  }
}
