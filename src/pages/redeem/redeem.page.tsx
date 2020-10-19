import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image, Button, Col, Row, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import RedeemWizard from "./wizard/redeem-wizard";
import PolkaBTCImg from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import RedeemRequests from "./table/redeem-requests";
import { StoreType } from "../../common/types/util.types";
import { resetRedeemWizardAction } from "../../common/actions/redeem.actions";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";

export default function RedeemPage(): JSX.Element {
    const polkaBTC = useSelector((state: StoreType) => state.api);
    const storage = useSelector((state: StoreType) => state.storage);
    const dispatch = useDispatch();
    const [showWizard, setShowWizard] = useState(false);
    const [balancePolkaBTC, setBalancePolkaBTC] = useState("...");
    const [balanceDOT, setBalanceDOT] = useState("...");

    const handleClose = () => {
        dispatch(resetRedeemWizardAction());
        setShowWizard(false);
    };
    const handleShow = () => setShowWizard(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBTC) return;
            if (!storage) return;

            const address = polkaBTC.account?.toString();
            const accountId = polkaBTC.api.createType("AccountId", address) as any;
            const balancePolkaSAT = await polkaBTC.treasury.balancePolkaBTC(accountId);
            const balancePLANCK = await polkaBTC.collateral.balanceDOT(accountId);
            // TODO: write data to storage
            const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());
            const balanceDOT = planckToDOT(balancePLANCK.toString()); 
            setBalancePolkaBTC(balancePolkaBTC);
            setBalanceDOT(balanceDOT);
        };
        fetchData();
    }, [polkaBTC, storage]);

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
                            <Button variant="outline-dark" size="lg" block onClick={handleShow}>
                                Redeem PolkaBTC
                            </Button>
                        </Col>
                    </Row>

                    <RedeemRequests />

                    <Modal show={showWizard} onHide={handleClose} size={"lg"}>
                        <RedeemWizard handleClose={handleClose} />
                    </Modal>
                </div>
            </section>
        </div>
    );
}
