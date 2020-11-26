import React from "react";
import { Col, Row } from "react-bootstrap";


export default class Balances extends React.Component<{
    balanceDOT: string;
    balancePolkaBTC: string;
}> {
    render() {
        return (
            <Row className="mt-5">
                <Col xs="12">
                    <div className="heavy">Balances</div>
                </Col>
            </Row>
        );
    }
}
