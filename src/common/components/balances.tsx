import React from "react";
import { Col, Row } from "react-bootstrap";


export default class Balances extends React.Component<{
    balanceDOT: string;
    balancePolkaBTC: string;
}> {
    render() {
        return (
            <div>
                <Row className="mt-5">
                    <Col xs="12" sm={{ span: 6, offset: 3 }}>
                        <span className="heavy">{this.props.balancePolkaBTC}</span> PolkaBTC
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col xs="12" sm={{ span: 6, offset: 3 }}>
                        <span className="heavy">{this.props.balanceDOT}</span> DOT
                    </Col>
                </Row>
            </div>
        );
    }
}
