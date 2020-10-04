import React, { Component } from "react";
import { Image, Col, Row, Table } from "react-bootstrap";

import AppState from "../common/types/app.types";
import { VaultProps } from "../common/types/VaultState";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";

export default class VaultPage extends Component<AppState, VaultProps> {
    state: VaultProps = {
        balanceDOT: "loading...",
        balanceLockedDOT: "loading...",
        backedPolkaBTC: "loading...",
        collateralRate: "loading...",
        feesEarned: "loading...",
        redeems: [],
    };

    renderTableData(): JSX.Element[] {
        return this.state.redeems.map((redeem) => {
            return (
                <tr key={redeem.id}>
                    <td>
                        {redeem.id.substring(0, 10)}...{redeem.id.substring(50)}
                    </td>
                    <td>{redeem.amount}</td>
                    <td>{redeem.creation}</td>
                    <td>
                        {redeem.tx_id.substring(0, 10)}...{redeem.tx_id.substring(50)}
                    </td>
                    <td>{redeem.confirmations}</td>
                    <td>No</td>
                </tr>
            );
        });
    }

    render(): JSX.Element {
        const {
            balanceDOT,
            balanceLockedDOT,
            backedPolkaBTC,
            collateralRate,
            feesEarned,
            // FIXME
            // eslint-disable-next-line
            redeems,
        } = this.state;
        return (
            <div>
                <section className="jumbotron text-center white-background mt-2">
                    <div className="container mt-5">
                        <Image src={PolkaBTCImg} width="256"></Image>

                        <Row className="mt-5">
                            <Col xs="12" sm={{ span: 4, offset: 2 }}>
                                <h5 className="text-muted">DOT balance: {balanceDOT}</h5>
                            </Col>
                            <Col xs="12" sm={{ span: 4 }}>
                                <h5 className="text-muted">Locked DOT balance: {balanceLockedDOT}</h5>
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col xs="12" sm={{ span: 4, offset: 2 }}>
                                <h5 className="text-muted">PolkaBTC backed: {backedPolkaBTC}</h5>
                            </Col>
                            <Col xs="12" sm={{ span: 4 }}>
                                <h5 className="text-muted">Collateral rate: {collateralRate}%</h5>
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col xs="12" sm={{ span: 6, offset: 3 }}>
                                <h5 className="text-muted">Fees earned: {feesEarned} PolkaBTC</h5>
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
                            <tbody>{this.renderTableData()}</tbody>
                        </Table>
                    </div>
                </section>
            </div>
        );
    }
}
