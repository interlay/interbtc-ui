import React, { Component } from 'react';

import { RedeemProps } from "../types/RedeemState";
import { Table } from 'react-bootstrap';
import {shortAddress, shortTxId} from '../utils/utils';
import { FaCheck, FaHourglass } from 'react-icons/fa';

export default class RedeemRequests extends Component<RedeemProps, {}> {
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
                    <th>completed</th>
                </tr>
            </thead>
            <tbody>
              {
                this.props.redeemRequests.map((request) => {
                  return (
                    <tr>
                      <td>{request.id}</td>
                      <td>{request.amount} BTC</td>
                      <td>{request.creation}</td>
                      <td>{shortAddress(request.vaultAddress)}</td>
                      <td>{shortTxId(request.btcTx)}</td>
                      <td>{request.confirmations}</td>
                      <td>{request.completed ? <FaCheck></FaCheck> :<FaHourglass></FaHourglass>}</td>
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