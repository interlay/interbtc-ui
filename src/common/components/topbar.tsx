import React, { ReactElement, useEffect, useState } from "react";
import polkaBTCLogo from "../../assets/img/polkabtc/PolkaBTC_black.png";
import { Navbar, Nav, Image, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "../types/util.types";
import ButtonMaybePending from "./pending-button";
import { FaDiscord, FaGithub, FaEdit } from "react-icons/fa";
import { planckToDOT } from "@interlay/polkabtc";
import { updateBalanceDOTAction, showAccountModalAction } from "../actions/general.actions";
import { updateBalances } from "../utils/utils";
import { useTranslation } from 'react-i18next';


type TopbarProps = {
    address?: string;
    requestDOT: () => Promise<void>;
};

export default function Topbar(props: TopbarProps): ReactElement {
    const { extensions, address, relayerLoaded, vaultClientLoaded, polkaBtcLoaded, balanceDOT, balancePolkaBTC } = 
        useSelector((state: StoreType) => state.general);
    const [isRelayerConnected, setIsRelayerConnected] = useState(false);
    const [isVaultConnected, setIsVaultConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRequestPending, setIsRequestPending] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

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

            updateBalances(dispatch,address,balanceDOT,balancePolkaBTC);
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

    const getLabel = ():string => {
        if (!extensions.length)
            return "Connect Wallet";

        if (!address) 
            return "Select Account";

        return "Account:" + address.substring(0, 10) + "..." + address.substring(38);
    }

    return (
        <Navbar id="pbtc-topbar" bg="light" expand="lg" className="border-bottom shadow-sm top-bar">
            {!isLoading && 
            <React.Fragment>
                <Navbar.Brand>
                    <Link id="main-logo" className="text-decoration-none" to="/">
                        <Image src={polkaBTCLogo} width="90" className="d-inline-block align-top" height="30" fluid />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {polkaBtcLoaded && (
                            <Link className="nav-link" to="/dashboard">
                                {t("nav_dashboard")}
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
                        <Link className="nav-link" to="/user-guide">
                            {t("user_guide")}
                        </Link>
                        <Link className="nav-link" to="/about">
                            {t("nav_about")}
                        </Link>
                        <Link className="nav-link" to="/faq">
                            {t("nav_faq")}
                        </Link>
                    </Nav>

                    <Nav className="d-inline">
                        <DropdownButton  id="bug-report" title="Feedback" variant="outline-polkadot" size="sm" menuAlign="right" className="mr-2">
                            <a href="https://forms.gle/zzmzCrgTfmcXbNDd8" target="_blank" rel="noopener noreferrer">
                                <FaEdit></FaEdit> {t("feedback.feedback")}
                            </a>
                            <Dropdown.Divider />
                            <Dropdown.Header>{t("report_bug")}</Dropdown.Header>
                            <a href="https://github.com/interlay/polkabtc-ui/issues" target="_blank" rel="noopener noreferrer"><FaGithub></FaGithub> GitHub</a>
                            <a href="https://discord.gg/C8tjMbgVXh" target="_blank" rel="noopener noreferrer"><FaDiscord></FaDiscord> Discord</a>
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
                                    {t("request_dot")}
                                </ButtonMaybePending>
                            </Nav>
                            <Nav id="account-button" className="d-inline">
                                <Button
                                    variant="outline-polkadot"
                                    size="sm"
                                    style={{ borderRadius: "1em" }}
                                    onClick={() => dispatch(showAccountModalAction(true))}>
                                        {getLabel()}
                                </Button>
                            </Nav>
                        </React.Fragment>
                    )}
                </Navbar.Collapse>
            </React.Fragment>}
        </Navbar>
    );
}
