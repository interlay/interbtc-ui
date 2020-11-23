import React, { ReactElement, useEffect, useState } from "react";
import polkaBTCLogo from "../../assets/img/polkabtc/PolkaBTC_black.svg";
import { Navbar, Nav, Image, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../types/util.types";
import * as constants from "../../constants";
import ButtonMaybePending from "./pending-button";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { FaDiscord, FaGithub, FaEdit } from "react-icons/fa";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";
import { 
    updateBalancePolkaBTCAction, 
    updateBalanceDOTAction,
    showWalletPickerModalAction 
} from "../actions/general.actions";


type TopbarProps = {
    address?: string;
    onAccountClick: () => void;
    requestDOT: () => Promise<void>;
};

export default function Topbar(props: TopbarProps): ReactElement {
    const relayerLoaded = useSelector((state: StoreType) => state.general.relayerLoaded);
    const vaultClientLoaded = useSelector((state: StoreType) => state.general.vaultClientLoaded);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const [isRelayerConnected, setIsRelayerConnected] = useState(false);
    const [isVaultConnected, setIsVaultConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!relayerLoaded || !vaultClientLoaded || !polkaBtcLoaded) {
            setTimeout(()=>setIsLoading(false),2500);
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

            const accountId = window.polkaBTC.api.createType("AccountId", address);
            const balancePolkaSAT = await window.polkaBTC.treasury.balancePolkaBTC(accountId);
            const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
            const balancePolkaBTC = satToBTC(balancePolkaSAT.toString());
            const balanceDOT = planckToDOT(balancePLANCK.toString());
            dispatch(updateBalancePolkaBTCAction(balancePolkaBTC));
            dispatch(updateBalanceDOTAction(balanceDOT));
        };
        fetchData();
    }, [address, polkaBtcLoaded, dispatch]);

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

    const checkWallet = () => {
        if (!address) dispatch(showWalletPickerModalAction(true));
    }

    return (
        <Navbar bg="light" expand="lg" className="border-bottom shadow-sm top-bar">
            {!isLoading && 
            <React.Fragment>
                <Navbar.Brand>
                    <Link className="text-decoration-none" to="/">
                        <Image src={polkaBTCLogo} width="90" className="d-inline-block align-top" height="30" fluid />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {!constants.STATIC_PAGE_ONLY && polkaBtcLoaded && (
                            <Link className="nav-link" to="/issue" onClick={checkWallet}>
                                Issue
                            </Link>
                        )}
                        {!constants.STATIC_PAGE_ONLY && polkaBtcLoaded && (
                            <Link className="nav-link" to="/redeem" onClick={checkWallet}>
                                Redeem
                            </Link>
                        )}
                        {polkaBtcLoaded && (
                            <Link className="nav-link" to="/dashboard">
                                Dashboard
                            </Link>
                        )}
                        {isVaultConnected && (
                            <Link className="nav-link" to="/vault">
                                Vault
                            </Link>
                        )}
                        {isRelayerConnected && (
                            <Link className="nav-link" to="/staked-relayer">
                                Relayer
                            </Link>
                        )}
                        <Link className="nav-link" to="/user-guide">
                            User Guide
                        </Link>
                        <Link className="nav-link" to="/about">
                            About
                        </Link>
                        <Link className="nav-link" to="/faq">
                            FAQ
                        </Link>
                    </Nav>

                    <Nav className="d-inline">
                        <DropdownButton  id="bug-report" title="Feedback" variant="outline-polkadot" size="sm" menuAlign="right" className="mr-2">
                            <DropdownItem href="https://forms.gle/zzmzCrgTfmcXbNDd8" target="_blank">
                                <FaEdit></FaEdit> Feedback
                            </DropdownItem>
                            <Dropdown.Divider />
                            <Dropdown.Header>Report a bug:</Dropdown.Header>
                            <DropdownItem href="https://github.com/interlay/polkabtc-ui/issues" target="_blank"><FaGithub></FaGithub> GitHub</DropdownItem>
                            <DropdownItem href="https://discord.gg/C8tjMbgVXh" target="_blank"><FaDiscord></FaDiscord> Discord</DropdownItem>
                        </DropdownButton>
                    </Nav>
                    {props.address !== undefined && (
                        <React.Fragment>
                            <Nav className="d-inline">
                                <ButtonMaybePending
                                    variant="outline-polkadot"
                                    className="mr-2"
                                    size="sm"
                                    isPending={isRequestPending}
                                    onClick={requestDOT}>
                                    Request DOT
                                </ButtonMaybePending>
                            </Nav>
                            <Nav className="d-inline">
                                <Button
                                    variant="outline-polkadot"
                                    size="sm"
                                    style={{ borderRadius: "1em" }}
                                    onClick={() => props.onAccountClick()}>
                                    Account: {props.address.substring(0, 10)}...{props.address.substring(38)}
                                </Button>
                            </Nav>
                        </React.Fragment>
                    )}
                </Navbar.Collapse>
            </React.Fragment>}
        </Navbar>
    );
}
