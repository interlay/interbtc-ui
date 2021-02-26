import React, { ReactElement, useEffect, useState } from "react";
import polkaBTCLogo from "../../assets/img/polkabtc/PolkaBTC_black.png";
import { Navbar, Nav, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../types/util.types";
import ButtonMaybePending from "./pending-button";
import { planckToDOT } from "@interlay/polkabtc";
import { updateBalanceDOTAction, showAccountModalAction } from "../actions/general.actions";
import { updateBalances } from "../utils/utils";
import { useTranslation } from "react-i18next";
import Balances from "./balances";

type TopbarProps = {
    address?: string;
    requestDOT: () => Promise<void>;
};

export default function Topbar(props: TopbarProps): ReactElement {
    const {
        extensions,
        address,
        relayerLoaded,
        vaultClientLoaded,
        polkaBtcLoaded,
        balanceDOT,
        balancePolkaBTC,
    } = useSelector((state: StoreType) => state.general);
    const [isRelayerConnected, setIsRelayerConnected] = useState(false);
    const [isVaultConnected, setIsVaultConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (!relayerLoaded || !vaultClientLoaded || !polkaBtcLoaded) {
            setTimeout(() => setIsLoading(false), 2500);
            return;
        }

        const checkIsConnected = async () => {
            const relayerConnected = await window.relayer.isConnected();
            const vaultConnected = await window.vaultClient.isConnected();
            setIsRelayerConnected(relayerConnected);
            setIsVaultConnected(vaultConnected);
            setIsLoading(false);
        };
        checkIsConnected();
    }, [relayerLoaded, vaultClientLoaded, polkaBtcLoaded]);

    useEffect(() => {
        const fetchData = async () => {
            if (!polkaBtcLoaded || address === "") return;

            updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
        };
        fetchData();
    }, [address, polkaBtcLoaded, dispatch, balanceDOT, balancePolkaBTC]);

    const requestDOT = async () => {
        if (!polkaBtcLoaded) return;
        setIsRequestPending(true);
        try {
            await props.requestDOT();
            const accountId = window.polkaBTC.api.createType("AccountId", address);
            const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
            const balanceDOT = planckToDOT(balancePLANCK.toString());
            dispatch(updateBalanceDOTAction(balanceDOT));
        } catch (error) {
            console.log(error);
        }
        setIsRequestPending(false);
    };

    const getLabel = (): string => {
        if (!extensions.length) return "Connect Wallet";

        if (!address) return "Select Account";

        return address.substring(0, 10) + "..." + address.substring(38);
    };

    return (
        <Navbar id="pbtc-topbar" bg="light" expand="lg" className="border-bottom shadow-sm top-bar">
            {!isLoading && (
                <React.Fragment>
                    <Navbar.Brand>
                        <Link id="main-logo" className="text-decoration-none" to="/">
                            <Image
                                src={polkaBTCLogo}
                                width="90"
                                className="d-inline-block align-top"
                                height="30"
                                fluid
                            />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {polkaBtcLoaded && (
                                <Link className="nav-link" to="/app">
                                    {t("app")}
                                </Link>
                            )}
                            {polkaBtcLoaded && (
                                <Link className="nav-link" to="/dashboard">
                                    {t("nav_dashboard")}
                                </Link>
                            )}
                            {polkaBtcLoaded && (
                                <Link className="nav-link" to="/leaderboard">
                                    {t("nav_leaderboard")}
                                </Link>
                            )}
                            {isVaultConnected && (
                                <Link id="vault-nav-item" className="nav-link" to="/vault">
                                    {t("nav_vault")}
                                </Link>
                            )}
                            {isRelayerConnected && (
                                <Link id="relayer-nav-item" className="nav-link" to="/staked-relayer">
                                    {t("nav_relayer")}
                                </Link>
                            )}
                            <a
                                className="nav-link"
                                href="https://docs.polkabtc.io/#/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("nav_docs")}
                            </a>
                            <Link className="nav-link" to="/feedback">
                                {t("feedback.feedback")}
                            </Link>
                        </Nav>
                        {props.address !== undefined && (
                            <React.Fragment>
                                <Nav className="d-inline">
                                    <Button
                                        variant="outline-bitcoin"
                                        className="mr-2"
                                        style={{ borderRadius: "8px" }}
                                        size="sm"
                                    >
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://testnet-faucet.mempool.co/"
                                            style={{ textDecoration: "none", color: "#000" }}
                                        >
                                            {t("request_btc")}
                                        </a>
                                    </Button>
                                    <ButtonMaybePending
                                        variant="outline-polkadot"
                                        className="mr-2"
                                        style={{ borderRadius: "8px" }}
                                        size="sm"
                                        isPending={isRequestPending}
                                        onClick={requestDOT}
                                    >
                                        {t("request_dot")}
                                    </ButtonMaybePending>
                                </Nav>
                                <Balances balanceDOT={balanceDOT} balancePolkaBTC={balancePolkaBTC}></Balances>
                                <Nav id="account-button" className="d-inline">
                                    <Button
                                        variant="outline-polkadot"
                                        size="sm"
                                        style={{ borderRadius: "8px" }}
                                        onClick={() => dispatch(showAccountModalAction(true))}
                                    >
                                        {getLabel()}
                                    </Button>
                                </Nav>
                            </React.Fragment>
                        )}
                    </Navbar.Collapse>
                </React.Fragment>
            )}
        </Navbar>
    );
}
