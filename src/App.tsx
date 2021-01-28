import React, { useState, ReactElement, useEffect, useCallback } from "react";
import { FaucetClient, planckToDOT, satToBTC } from "@interlay/polkabtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createPolkabtcAPI, PolkaBTCAPI, StakedRelayerClient, VaultClient } from "@interlay/polkabtc";
import Big from "big.js";
import ReactTooltip from "react-tooltip";

import AccountModal from "./common/components/account-modal/account-modal";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import loadingImg from "./assets/img/dual-ball-loading.gif";
import {
    isPolkaBtcLoaded,
    isStakedRelayerLoaded,
    isVaultClientLoaded,
    changeAddressAction,
    initGeneralDataAction,
    setInstalledExtensionAction,
    showAccountModalAction,
    updateAccountsAction,
    isFaucetLoaded,
} from "./common/actions/general.actions";
import * as constants from "./constants";
import "./i18n";

// theme
// FIXME: Clean-up and move to scss
import "./_general.scss";
import "react-toastify/dist/ReactToastify.css";

// app imports
import Topbar from "./common/components/topbar";
import Footer from "./common/components/footer/footer";
import AppPage from "./pages/app/app.page";
import AboutPage from "./pages/about.page";
import FaqPage from "./pages/faq.page";
import UserGuidePage from "./pages/user-guide.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import VaultDashboardPage from "./pages/vault-dashboard/vault-dashboard.page";
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import VaultsDashboard from "./pages/dashboard/vaults/vaults.dashboard.page";
import { useSelector, useDispatch } from "react-redux";
import { StoreType, ParachainStatus } from "./common/types/util.types";
import IssueDashboard from "./pages/dashboard/issue/issue.dashboard.page";
import RedeemDashboard from "./pages/dashboard/redeem/redeem.dashboard.page";
import LandingPage from "./pages/landing/landing.page";
import startFetchingLiveData from "./common/utils/live-data";
import RelayDashboard from "./pages/dashboard/relay/relay.dashboard.page";

function connectToParachain(): Promise<PolkaBTCAPI> {
    return createPolkabtcAPI(
        constants.PARACHAIN_URL,
        constants.BITCOIN_NETWORK === "regtest" ? constants.BITCOIN_REGTEST_URL : constants.BITCOIN_NETWORK
    );
}

export default function App(): ReactElement {
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const address = useSelector((state: StoreType) => state.general.address);
    const [isLoading, setIsLoading] = useState(true);
    const extensions = useSelector((state: StoreType) => state.general.extensions);
    const dispatch = useDispatch();

    const requestDotFromFaucet = async (): Promise<void> => {
        if (!address) return;

        try {
            const receiverId = window.polkaBTC.api.createType("AccountId", address);
            await window.faucet.fundAccount(receiverId);
            toast.success("Your account has been funded.");
        } catch (error) {
            toast.error(`Funding failed. You can only use the faucet once every 6 hours. ${error}`);
        }
    };

    const selectAccount = useCallback(
        async (newAddress: string): Promise<void> => {
            if (!polkaBtcLoaded || !newAddress) {
                return;
            }

            await web3Enable(constants.APP_NAME);
            const { signer } = await web3FromAddress(newAddress);
            window.polkaBTC.setAccount(newAddress, signer);

            dispatch(showAccountModalAction(false));
            dispatch(changeAddressAction(newAddress));
        },
        [polkaBtcLoaded, dispatch]
    );

    const createAPIInstance = useCallback(async (): Promise<void> => {
        try {
            window.relayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
            dispatch(isStakedRelayerLoaded(true));

            window.vaultClient = new VaultClient(constants.VAULT_CLIENT_URL);
            dispatch(isVaultClientLoaded(true));

            window.faucet = new FaucetClient(constants.FAUCET_URL);
            dispatch(isFaucetLoaded(true));

            setTimeout(() => {
                if (!window.polkaBTC) {
                    toast.warn(
                        "Unable to connect to the BTC-Parachain. " +
                            "Please check your internet connection or try again later."
                    );
                }
            }, 5000);
            window.polkaBTC = await connectToParachain();
            dispatch(isPolkaBtcLoaded(true));
            setIsLoading(false);
        } catch (error) {
            if (!window.polkaBTC)
                toast.warn(
                    "Unable to connect to the BTC-Parachain. " +
                        "Please check your internet connection or try again later."
                );
        }
    }, [dispatch]);

    useEffect((): void => {
        // Do not load data if showing static landing page only
        if (constants.STATIC_PAGE_ONLY) return;

        const initDataOnAppBootstrap = async () => {
            if (!polkaBtcLoaded) return;

            try {
                const totalPolkaSAT = await window.polkaBTC.treasury.totalPolkaBTC();
                const totalLockedPLANCK = await window.polkaBTC.collateral.totalLockedDOT();
                const totalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
                const totalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();
                const btcRelayHeight = Number(await window.polkaBTC.btcRelay.getLatestBlockHeight());
                const bitcoinHeight = await window.polkaBTC.btcCore.getLatestBlockHeight();
                const state = await window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain();
                dispatch(
                    initGeneralDataAction(
                        totalPolkaBTC,
                        totalLockedDOT,
                        btcRelayHeight,
                        bitcoinHeight,
                        state.isError
                            ? ParachainStatus.Error
                            : state.isRunning
                            ? ParachainStatus.Running
                            : ParachainStatus.Shutdown
                    )
                );
            } catch (error) {
                console.log(error);
            }
        };
        initDataOnAppBootstrap();
    }, [dispatch, polkaBtcLoaded]);

    useEffect((): void => {
        // Do not load data if showing static landing page only
        if (constants.STATIC_PAGE_ONLY) return;

        const loadAccountData = async () => {
            if (!polkaBtcLoaded || extensions.length) return;

            const browserExtensions = await web3Enable(constants.APP_NAME);
            dispatch(setInstalledExtensionAction(browserExtensions.map((ext) => ext.name)));

            const allAccounts = await web3Accounts();
            if (allAccounts.length === 0) {
                dispatch(changeAddressAction(""));
                return;
            }

            const accounts = allAccounts.map(({ address }) => address);
            dispatch(updateAccountsAction(accounts));

            let newAddress: string | undefined = undefined;
            if (accounts.includes(address)) {
                newAddress = address;
            } else if (accounts.length === 1) {
                newAddress = accounts[0];
            }

            if (newAddress) {
                const { signer } = await web3FromAddress(newAddress);
                window.polkaBTC.setAccount(newAddress, signer);
                dispatch(changeAddressAction(newAddress));
            } else dispatch(changeAddressAction(""));
        };
        loadAccountData();
    }, [address, polkaBtcLoaded, dispatch, extensions.length]);

    useEffect(() => {
        // Do not load data if showing static landing page only
        if (constants.STATIC_PAGE_ONLY) return;

        const loadData = async () => {
            try {
                if (polkaBtcLoaded) return;

                setTimeout(() => {
                    if (isLoading) setIsLoading(false);
                }, 3000);
                await createAPIInstance();
                keyring.loadAll({});
            } catch (e) {
                toast.warn("Could not connect to the Parachain, please try again in a few seconds", {
                    autoClose: false,
                });
            }
        };
        loadData();
        startFetchingLiveData(dispatch);
    },[createAPIInstance, isLoading, polkaBtcLoaded, dispatch]);


    return (
        <React.Fragment>
            <Router>
                {!isLoading || constants.STATIC_PAGE_ONLY ? (
                    <div className="main d-flex flex-column min-vh-100 polkabtc-background fade-in-animation">
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                        <ReactTooltip place="top" type="dark" effect="solid" />
                        <AccountModal selected={address} onSelected={selectAccount} />
                        {!constants.STATIC_PAGE_ONLY && <Topbar address={address} requestDOT={requestDotFromFaucet} />}
                        <Switch>
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/staked-relayer">
                                    <StakedRelayerPage />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard/vaults">
                                    <VaultsDashboard />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard/issue">
                                    <IssueDashboard />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard/redeem">
                                    <RedeemDashboard />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard/relay">
                                    <RelayDashboard />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard">
                                    <DashboardPage />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/vault">
                                    <VaultDashboardPage />
                                </Route>
                            )}
                            <Route path="/" exact>
                                <LandingPage />
                            </Route>
                            <Route path="/user-guide">
                                <UserGuidePage />
                            </Route>
                            <Route path="/about">
                                <AboutPage />
                            </Route>
                            <Route path="/faq">
                                <FaqPage />
                            </Route>
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route exact path="/app">
                                    <AppPage />
                                </Route>
                            )}
                        </Switch>
                        <Footer />
                    </div>
                ) : (
                    <div className="main-loader">
                        <img src={loadingImg} alt="loading animation"></img>
                    </div>
                )}
            </Router>
        </React.Fragment>
    );
}
