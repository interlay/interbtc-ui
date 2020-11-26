import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";

import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import IssueRequests from "./table/issue-requests";
import { resetIssueWizardAction } from "../../common/actions/issue.actions";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../common/types/util.types";
import IssueWizard from "./wizard/issue-wizard";
import { showAccountModalAction } from "../../common/actions/general.actions";
import Balances from "../../common/components/balances";

export default function IssuePage(): JSX.Element {
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const balancePolkaBTC = useSelector((state: StoreType) => state.general.balancePolkaBTC);
    const balanceDOT = useSelector((state: StoreType) => state.general.balanceDOT);
    const address = useSelector((state: StoreType) => state.general.address);
    const extensions = useSelector((state: StoreType) => state.general.extensions);

    const handleClose = () => {
        dispatch(resetIssueWizardAction());
        setShowWizard(false);
    };

    const handleShow = () => {
        if (extensions.length && address) {
            setShowWizard(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    }

    return (
        <div>
            <section className="jumbotron text-center white-background min-vh-100">
                <div className="container mt-5">
                    <Link to="/">
                        <Image src={PolkaBTCImg} width="256"></Image>
                    </Link>

                    {address && extensions.length &&
                        <React.Fragment>
                            <Balances balancePolkaBTC={balancePolkaBTC} balanceDOT={balanceDOT}></Balances>
                        </React.Fragment>
                    }
                    <Row className="mt-5 mb-5">
                        <Col className="mt-2" xs="12" sm={{ span: 4, offset: 4 }}>
                            <Button variant="outline-polkadot" size="lg" block onClick={handleShow}>
                                Issue PolkaBTC
                            </Button>
                        </Col>
                    </Row>

                    <IssueRequests handleShow={handleShow} />

                    <Modal show={showWizard} onHide={handleClose} size={"lg"}>
                        <IssueWizard handleClose={handleClose} />
                    </Modal>
                </div>
            </section>
        </div>
    );
}
