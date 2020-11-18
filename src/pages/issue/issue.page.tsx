import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";

import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import IssueRequests from "./table/issue-requests";
import { resetIssueWizardAction } from "../../common/actions/issue.actions";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../common/types/util.types";
import IssueWizard from "./wizard/issue-wizard";

export default function IssuePage(): JSX.Element {
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const balancePolkaBTC = useSelector((state: StoreType) => state.general.balancePolkaBTC);
    const balanceDOT = useSelector((state: StoreType) => state.general.balanceDOT);

    const handleClose = () => {
        dispatch(resetIssueWizardAction());
        setShowWizard(false);
    };

    const handleShow = () => setShowWizard(true);

    return (
        <div>
            <section className="jumbotron text-center white-background min-vh-100">
                <div className="container mt-5">
                    <Link to="/">
                        <Image src={PolkaBTCImg} width="256"></Image>
                    </Link>

                    <Row className="mt-5">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">PolkaBTC balance: {balancePolkaBTC}</h5>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">DOT balance: {balanceDOT}</h5>
                        </Col>
                    </Row>
                    <Row className="mt-5 mb-5">
                        <Col className="mt-2" xs="12" sm={{ span: 4, offset: 4 }}>
                            <Button variant="outline-polkadot" size="lg" block onClick={handleShow}>
                                Issue PolkaBTC
                            </Button>
                        </Col>
                    </Row>

                    <IssueRequests handleShow={handleShow}/>

                    <Modal show={showWizard} onHide={handleClose} size={"lg"}>
                        <IssueWizard handleClose={handleClose} />
                    </Modal>
                </div>
            </section>
        </div>
    );
}
