import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import RedeemWizard from "./wizard/redeem-wizard";
import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import RedeemRequests from "./table/redeem-requests";
import { StoreType } from "../../common/types/util.types";
import { resetRedeemWizardAction } from "../../common/actions/redeem.actions";
import { 
    hasFeedbackModalBeenDisplayedAction, 
    showAccountModalAction
} from "../../common/actions/general.actions";
import Feedback from "./feedback/feedback";
import Balances from "../../common/components/balances";

export default function RedeemPage(): JSX.Element {
    const balancePolkaBTC = useSelector((state: StoreType) => state.general.balancePolkaBTC);
    const balanceDOT = useSelector((state: StoreType) => state.general.balanceDOT);
    const address = useSelector((state: StoreType) => state.general.address);
    const extensions = useSelector((state: StoreType) => state.general.extensions);
    const hasFeedbackModalBeenDisplayed = useSelector(
        (state: StoreType) => state.general.hasFeedbackModalBeenDisplayed
    );
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleCloseWizard = () => {
        dispatch(resetRedeemWizardAction());
        setShowWizard(false);
    };

    const handleShowWizard = () => {
        if(address && extensions.length) {
            setShowWizard(true);
        } else {
            dispatch(showAccountModalAction(true));
        }
    }

    const handleShowFeedbackModal = function () {
        if (!hasFeedbackModalBeenDisplayed) {
            setShowFeedbackModal(true);
        }
    };

    const handleCloseFeedbackModal = () => {
        dispatch(hasFeedbackModalBeenDisplayedAction(true));
        setShowFeedbackModal(false);
    };

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
                                <Button variant="outline-bitcoin" size="lg" block onClick={handleShowWizard} disabled={balancePolkaBTC === '0' }>
                                    Redeem PolkaBTC
                            </Button>
                            </Col>
                            {balancePolkaBTC === '0' &&
                                <Col className="mt-2" xs="12" sm={{ span: 6, offset: 3 }}>
                                    <p>You don't have any PolkaBTC to redeem.</p>
                                </Col>
                            }
                    </Row>
                    <RedeemRequests handleShowFeedbackModal={handleShowFeedbackModal} />

                    <Modal show={showWizard} onHide={handleCloseWizard} size={"lg"}>
                        <RedeemWizard handleClose={handleCloseWizard} />
                    </Modal>

                    <Modal
                        show={showFeedbackModal && !hasFeedbackModalBeenDisplayed}
                        onHide={handleCloseFeedbackModal}
                        size={"lg"}
                    >
                        <Feedback handleClose={handleCloseFeedbackModal} />
                    </Modal>
                </div>
            </section>
        </div>
    );
}
