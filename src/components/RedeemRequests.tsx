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
                <tr>
                  <td>1</td>
                  <td>0.5 BTC</td>
                  <td>21 Jun 2020 19:08</td>
                  <td>aa269f4bd72bd...7d10a62a9cdd8d7f</td>
                  <td>3b4162a307fab...b588d61a9069e762</td>
                  <td>18</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>0.2 BTC</td>
                  <td>21 Jun 2020 21:08</td>
                  <td>aa269f4bd72bd...7d10a62a9cdd8d7f</td>
                  <td>d3c6652dfa406...e4aacb4c441e030e</td>
                  <td>2</td>
                  <td>No</td>
                </tr>
            </tbody>
        </Table>
      </div>
    )
  }
}