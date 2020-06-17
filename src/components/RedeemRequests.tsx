import React, { Component } from 'react';

import { RedeemProps } from "../types/RedeemState";
import { Table } from 'react-bootstrap';

export default class RedeemRequests extends Component<RedeemProps, {}> {
  constructor(props: RedeemProps) {
    super(props);
  }

  render(){
    return(
      <div>
        <Table hover responsive size={"md"}>
            <thead>
                <tr>
                    <th>Redeem ID</th>
                    <th>Amount</th>
                    <th>Creation</th>
                    <th>Vault BTC Address</th>
                    <th>BTC Transaction</th>
                    <th>Confirmations</th>
                    <th>Complete</th>
                </tr>
            </thead>
            <tbody>
              {
                this.props.redeemRequests.map((request) => {
                  return (
                    <tr>
                      <td>{request.id}</td>
                      <td>{request.amount}</td>
                      <td>{request.creation}</td>
                      <td>{request.vaultAddress}</td>
                      <td>{request.btcTx}</td>
                      <td>{request.confirmations}</td>
                      <td>Yes</td>
                    </tr>
                  );
                })
              }
            </tbody>
        </Table>
      </div>
    )
  }
}