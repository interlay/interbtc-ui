import React, { Component } from 'react';

import { IssueProps, IssueRequest } from "../types/IssueState";
import { Table } from 'react-bootstrap';
import {shortAddress, shortTxId} from '../utils/utils';
import { FaCheck, FaHourglass } from 'react-icons/fa';

class IssueRequests extends Component<IssueProps, {}> {
  constructor(props: IssueProps) {
    super(props);
  }

  render(){
    return(
      <div>
        <Table hover responsive size={"md"}>
            <thead>
                <tr>
                    <th>Issue ID</th>
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
                this.props.issueRequests.map((request) => {
                  return (
                    <tr>
                      <td>{request.id}</td>
                      <td>{request.amount} PolkaBTC</td>
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

export default IssueRequests;
