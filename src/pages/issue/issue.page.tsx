import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";

import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.png";
import IssueRequests from "./table/issue-requests";
import { resetIssueWizardAction } from "../../common/actions/issue.actions";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../common/types/util.types";
import IssueWizard from "./wizard/issue-wizard";

export default function IssuePage(): JSX.Element {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const [balancePolkaBTC, setBalancePolkaBTC] = useState("...");
    const [balanceDOT, setBalanceDOT] = useState("...");

    const handleClose = () => {
        dispatch(resetIssueWizardAction());
        setShowWizard(false);
    };
    const handleShow = () => setShowWizard(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;
            if (!storage) return;

            // TODO: implement call to get balances
            const balancePolkaBTC = "";
            const balanceDOT = "";
            // TODO: write data to storage
            setBalancePolkaBTC(balancePolkaBTC);
            setBalanceDOT(balanceDOT);
        };
        fetchData();
    }, [polkaBTC, storage]);


    return (
        <div>
            <section className="jumbotron text-center white-background mt-2">
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
                            <Button variant="outline-dark" size="lg" block onClick={handleShow}>
                                Issue PolkaBTC
                                </Button>
                        </Col>
                    </Row>

                    <IssueRequests />

                    <Modal show={showWizard} onHide={handleClose}>
                        <IssueWizard handleClose={handleClose} />
                    </Modal>
                </div>
            </section>
        </div>
    );
}
