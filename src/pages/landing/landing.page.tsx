import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { StoreType } from "../../common/types/util.types";
import * as constants from "../../constants";
import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_white.svg";
import { showAccountModalAction } from "../../common/actions/general.actions";
import { useTranslation } from "react-i18next";

import "./landing.page.scss";

export default function LandingPage(): JSX.Element {
    const { totalPolkaBTC, totalLockedDOT, polkaBtcLoaded, address, extensions } = useSelector(
        (state: StoreType) => state.general
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const checkWalletAndAccount = () => {
        if (!extensions.length || !address) {
            dispatch(showAccountModalAction(true));
        }
    };

    return (
        <div>
            <section className="jumbotron min-vh-90 text-center transparent-background">
                <div className="container mt-5">
                    <Link to="/">
                        <Image src={PolkaBTCImg} width="256"></Image>
                    </Link>
                    <h1 className="text-white mt-5">PolkaBTC</h1>
                    <h2 className="text-white">{t("landing.defi_ecosystem")}</h2>

                    {!constants.STATIC_PAGE_ONLY ? (
                        <div>
                            <Row className="mt-4">
                                <Col xs="12" sm={{ span: 6, offset: 3 }}>
                                    <h5 className="text-white">
                                        {t("landing.issued")} {totalPolkaBTC} PolkaBTC
                                    </h5>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col xs="12" sm={{ span: 6, offset: 3 }}>
                                    <h5 className="text-white">
                                        {t("locked")} {totalLockedDOT} DOT
                                    </h5>
                                </Col>
                            </Row>
                            {polkaBtcLoaded && (
                                <Row className="mt-5">
                                    <Col className="mt-2" xs="12" sm={{ span: 4, offset: 2 }}>
                                        <NavLink className="text-decoration-none" to="/app">
                                            <Button
                                                variant="outline-polkadot"
                                                size="lg"
                                                block
                                                onClick={checkWalletAndAccount}
                                            >
                                                {t("issue_page.issue_polkabtc")}
                                            </Button>
                                        </NavLink>
                                    </Col>
                                    <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                                        <NavLink className="text-decoration-none" to="/app">
                                            <Button
                                                variant="outline-bitcoin"
                                                size="lg"
                                                block
                                                onClick={checkWalletAndAccount}
                                            >
                                                {t("redeem_page.redeem_polkaBTC")}
                                            </Button>
                                        </NavLink>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Row className="mt-5">
                                <Col className="mt-2" xs="12" sm={{ span: 4, offset: 2 }}>
                                    <NavLink className="text-decoration-none" to="/about">
                                        <Button variant="outline-bitcoin" size="lg" block>
                                            {t("landing.how_it_works")}
                                        </Button>
                                    </NavLink>
                                </Col>
                                <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                                    <a className="text-decoration-none" href="https://alpha.polkabtc.io">
                                        <Button variant="outline-polkadot" size="lg" block>
                                            {t("landing.testnet")}
                                        </Button>
                                    </a>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
