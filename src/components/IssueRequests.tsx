import React, { Component } from 'react';

import { IssueProps, IssueRequest } from "../types/IssueState";
import { Table } from 'react-bootstrap';

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
                      <td>{request.amount}</td>
                      <td>{request.creation}</td>
                      <td>{request.vaultAddress}</td>
                      <td>{request.btcTx}</td>
                      <td>{request.confirmations}</td>
                      <td>Confirm</td>
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
