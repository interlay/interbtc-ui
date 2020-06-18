import React, { Component } from 'react';
import { Image, Button, Col, Row, Modal, Card, Table } from 'react-bootstrap';

import AppState from '../types/AppState';
import { Redeem, VaultProps } from '../types/VaultState';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
import { Vault } from '../controllers/Vault';

export default class VaultPage extends Component<AppState, VaultProps> {
  state: VaultProps = {
    balancePolkaBTC: "loading...",
    balanceDOT: "loading...",
    balanceLockedDOT: "loading...",
    redeems: [],
  }

  constructor(props: AppState) {
    super(props);
  }

  async componentDidMount() {
    await this.getParachainData();
    let vault = new Vault();
    let result = await vault.getRedeems();

    this.setState({
      redeems: result,
    })
  }

  async getParachainData() {
    if (!this.props.parachain.api) {
      await this.props.parachain.connect();
    }
    if (this.props.parachain.api && this.props.account) {
      const balancePolkaBTC = await this.props.parachain.getBalancePolkaBTC(this.props.account);
      const balanceDOT = await this.props.parachain.getBalanceDOT(this.props.account);
      const balanceLockedDOT = await this.props.parachain.getBalanceDOT(this.props.account);
      this.setState({
        balancePolkaBTC: balancePolkaBTC,
        balanceDOT: balanceDOT,
        balanceLockedDOT: balanceLockedDOT
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
      )
    });
  }

  render() {
    const balancePolkaBTC = this.state.balancePolkaBTC;
    const balanceDOT = this.state.balanceDOT;
    const balanceLockedDOT = this.state.balanceLockedDOT;
    const redeems = this.state.redeems;
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
            <Row className="mt-1">
              <Col xs="12" sm={{span: 6, offset: 3}}>
                <h5 className="text-muted">Locked DOT balance: { balanceLockedDOT }</h5>
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
    )
  }
}
