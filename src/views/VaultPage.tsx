import React, { Component } from 'react';
import { Image, Button, Col, Row, Modal, Card, Table } from 'react-bootstrap';

import AppState from '../types/AppState';
import { Redeem, VaultProps } from '../types/VaultState';

import PolkaBTCImg from '../assets/img/polkabtc/PolkaBTC_black.png';
import { Vault } from '../controllers/Vault';

export default class VaultPage extends Component<AppState, VaultProps> {
  state: VaultProps = {
    redeems: [],
  }

  constructor(props: AppState) {
    super(props);
  }

  async componentDidMount() {
    let vault = new Vault();
    let result = await vault.getRedeems();

    this.setState({
      redeems: result,
    })
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
    const redeems = this.state.redeems;
    return (
      <div>
        <section className="jumbotron text-center white-background mt-2">
          <div className="container mt-5">
            <Image src={ PolkaBTCImg } width='256'></Image>

            <Table hover responsive size={"md"}>
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