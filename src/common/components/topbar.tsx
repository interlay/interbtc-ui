import React, { ReactElement, useEffect, useState } from "react";
import polkaBTCLogo from "../../assets/img/polkabtc/PolkaBTC_black.png";
import { Navbar, Nav, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../types/util.types";
import * as constants from "../../constants";

type TopbarProps = {
    address?: string;
    onAccountClick: () => void;
};

export default function Topbar(props: TopbarProps): ReactElement {
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!relayerLoaded) return;

        const checkIsConnected = async () => {
            const connected = await window.relayer.isConnected();
            setIsLoading(false);
            setIsConnected(connected);
        };
        checkIsConnected();
    }, [relayerLoaded]);

    return (
        <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
            <Navbar.Brand>
                <Link className="text-decoration-none" to="/">
                    <Image src={polkaBTCLogo} width="90" className="d-inline-block align-top" height="30" fluid />
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {!isLoading &&  
                <Nav className="mr-auto">
                    {!constants.STATIC_PAGE_ONLY && (
                        <Link className="nav-link" to="/issue">
                            Issue
                        </Link>
                    )}
                    {!constants.STATIC_PAGE_ONLY && (
                        <Link className="nav-link" to="/redeem">
                            Redeem
                        </Link>
                    )}
                    <Link className="nav-link" to="/dashboard">
                        Dashboard
                    </Link>
                    {true && (
                        <Link className="nav-link" to="/vault-dashboard">
                            Vault Dashboard
                        </Link>
                    )}
                    {isConnected && (
                        <Link className="nav-link" to="/staked-relayer">
                            Staked Relayer
                        </Link>
                    )}
                    <Link className="nav-link" to="/about">
                        How it works
                    </Link>
                </Nav>
                }
               
                <Nav className="d-inline">
                    {props.address !== undefined && (
                        <Button
                            variant="outline-polkadot"
                            size="sm"
                            style={{ borderRadius: "1em" }}
                            onClick={() => props.onAccountClick()}
                        >
                            Account: {props.address.substring(0, 10)}...{props.address.substring(38)}
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
