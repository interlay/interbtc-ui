import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Image, Button, Col, Row } from "react-bootstrap";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_black.png";
import { useSelector } from "react-redux";
import { StoreType } from "../common/types/util.types";
import { CommonStorage } from "../common/types/storage.types";

export default function LandingPage() {
    const [totalPolkaBTC, setTotalPolkaBTC] = useState("...");
    const [totalLockedDOT, setTotalLockedDOT] = useState("...");
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;
            if (!storage) return;
            // TODO: get data from parachain
            // TODO: write parachain data to storage 
            const totalPolkaBTC = storage.getItemCommon(CommonStorage.totalPolkaBTC);
            const totalLockedDOT = storage.getItemCommon(CommonStorage.totalLockedDOT);
            setTotalPolkaBTC(totalPolkaBTC);
            setTotalLockedDOT(totalLockedDOT);
        };
        fetchData();
    }, [polkaBTC, storage]);

    return (
        <div>
            <section className="jumbotron min-vh-100 text-center white-background mt-2">
                <div className="container mt-5">
                    <Link to="/">
                        <Image src={PolkaBTCImg} width="256"></Image>
                    </Link>
                    <h3 style={{ fontSize: "1.5em" }} className="lead text-muted mt-3">
                        PolkaBTC: Trustless and open DeFi access for your Bitcoin.
                        </h3>

                    <Row className="mt-5">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">Issued: {totalPolkaBTC} PolkaBTC</h5>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col xs="12" sm={{ span: 6, offset: 3 }}>
                            <h5 className="text-muted">Locked: {totalLockedDOT} DOT</h5>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col className="mt-2" xs="12" sm={{ span: 4, offset: 2 }}>
                            <NavLink className="text-decoration-none" to="/issue">
                                <Button variant="outline-dark" size="lg" block>
                                    Issue PolkaBTC
                                    </Button>
                            </NavLink>
                        </Col>
                        <Col className="mt-2" xs="12" sm={{ span: 4 }}>
                            <NavLink className="text-decoration-none" to="/redeem">
                                <Button variant="outline-primary" size="lg" block>
                                    Redeem PolkaBTC
                                    </Button>
                            </NavLink>
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}