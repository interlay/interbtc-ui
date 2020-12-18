import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import RedeemWizard from "./wizard/redeem-wizard";
import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import RedeemRequests from "./table/redeem-requests";
import { StoreType, ParachainStatus } from "../../common/types/util.types";
import { resetRedeemWizardAction } from "../../common/actions/redeem.actions";
import { 
    hasFeedbackModalBeenDisplayedAction, 
    showAccountModalAction
} from "../../common/actions/general.actions";
import Feedback from "./feedback/feedback";
import Balances from "../../common/components/balances";
import { toast } from "react-toastify";
import * as constants from "../../constants";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';

import "./redeem.page.scss";


export default function RedeemPage(): JSX.Element {
    const { t } = useTranslation();
    const { balancePolkaBTC, balanceDOT, address, extensions, hasFeedbackModalBeenDisplayed, btcRelayHeight,
        bitcoinHeight, stateOfBTCParachain } = useSelector((state: StoreType) => state.general);
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleCloseWizard = () => {
        dispatch(resetRedeemWizardAction());
        setShowWizard(false);
    };

    const openWizard = () => {
        if (stateOfBTCParachain === ParachainStatus.Error) {
            toast.error(i18n.t("redeem_page.error_in_parachain"));
            return;
        }
        if (bitcoinHeight-btcRelayHeight>constants.BLOCKS_BEHIND_LIMIT) {
            toast.error(i18n.t("redeem_page.error_more_than_6_blocks_behind"));
            return;
        }
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
                                <Button variant="outline-bitcoin" size="lg" block onClick={openWizard} disabled={balancePolkaBTC === '0' }>
                                    {t("redeem_page.redeem_polkaBTC")}
                                </Button>
                            </Col>
                            {balancePolkaBTC === '0' &&
                                <Col className="mt-2" xs="12" sm={{ span: 6, offset: 3 }}>
                                    <p>{t("redeem_page.no_polkabtc_to_redeem")}</p>
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
