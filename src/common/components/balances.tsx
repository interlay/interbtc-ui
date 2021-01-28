import React, { ReactElement } from "react";
import { Col, Row } from "react-bootstrap";

type BalancesProps = {
    balancePolkaBTC?: string;
    balanceDOT?: string;
};

export default function Balances(props: BalancesProps): ReactElement {
    return (
        <div>
            <Row className="mt-5">
                <Col xs="12" sm={{ span: 6, offset: 3 }}>
                    <span className="heavy">{props.balancePolkaBTC}</span> PolkaBTC
                </Col>
            </Row>
            <Row className="mt-1">
                <Col xs="12" sm={{ span: 6, offset: 3 }}>
                    <span className="heavy">{props.balanceDOT}</span> DOT
                </Col>
            </Row>
        </div>
    );
}
