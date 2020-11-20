import React, { useState, ReactElement, useEffect, useCallback } from "react";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createPolkabtcAPI, PolkaBTCAPI, StakedRelayerClient, VaultClient } from "@interlay/polkabtc";
import { Modal } from "react-bootstrap";
import Big from "big.js";

import WalletModal from "./common/components/wallet-modal/wallet-modal";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import loadingImg from "./assets/img/dual-ball-loading.gif";
import AccountSelector from "./pages/account-selector";
import {
    isPolkaBtcLoaded,
    isStakedRelayerLoaded,
    isVaultClientLoaded,
    changeAddressAction,
    setTotalIssuedAndTotalLockedAction
} from "./common/actions/general.actions";
import * as constants from "./constants";

// theme
// FIXME: Clean-up and move to scss
import "./_general.scss";
import "react-toastify/dist/ReactToastify.css";

// app imports
import Topbar from "./common/components/topbar";
import Footer from "./common/components/footer/footer";
import LandingPage from "./pages/landing/landing.page";
import IssuePage from "./pages/issue/issue.page";
import RedeemPage from "./pages/redeem/redeem.page";
import AboutPage from "./pages/about.page";
import FaqPage from "./pages/faq.page";
import UserGuidePage from "./pages/user-guide.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import VaultDashboardPage from "./pages/vault-dashboard/vault-dashboard.page";
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "./common/types/util.types";


function connectToParachain(): Promise<PolkaBTCAPI> {
    return createPolkabtcAPI(
        constants.PARACHAIN_URL,
        constants.BITCOIN_NETWORK === "regtest" ? constants.BITCOIN_REGTEST_URL : constants.BITCOIN_NETWORK
    );
}

export default function App(): ReactElement {
    const [accounts,setAccounts] = useState<string[]>([]);
    const [address,setAddress] = useState("");
    const [showSelectAccount,setShowSelectAccount] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
    const dispatch = useDispatch();

    const requestDotFromFaucet = async (): Promise<void> => {
        if (!address) return;

        try {
            let api = await connectToParachain();
            api.setAccount(keyring.createFromUri(constants.FAUCET_ADDRESS_SEED, undefined, "sr25519"));
            await api.collateral.transferDOT(address, constants.FAUCET_AMOUNT);
            toast.success("You have received " + planckToDOT(constants.FAUCET_AMOUNT) + " DOT.");
        } catch (error) {
            toast.error(error);
        }
    }

    const selectAccount = async (newAddress: string): Promise<void> => {
        if (!polkaBtcLoaded) {
            return;
        }

        const { signer } = await web3FromAddress(newAddress);
        window.polkaBTC.setAccount(newAddress, signer);
        setAddress(newAddress);
        setShowSelectAccount(false);

        dispatch(isPolkaBtcLoaded(true));
        dispatch(changeAddressAction(address));
    }

    const getAccount = useCallback(async (): Promise<void> => {
        if (address) return;

        await web3Enable(constants.APP_NAME);

        const allAccounts = await web3Accounts();
        if (allAccounts.length === 0) {
            toast.warn(
                "No account found, you will not be able to execute any transaction. " +
                "Please check that your wallet is configured correctly.",
                {
                    autoClose: false,
                }
            );
            return;
        }

        const mappedAccounts = allAccounts.map(({ address }) => address);

        let newAddress : string | undefined = undefined;
        if (mappedAccounts.includes(address)) {
            newAddress = address;
        } else if (allAccounts.length === 1) {
            newAddress = allAccounts[0].address;
        }

        if (newAddress) {
            selectAccount(newAddress);
        } else {
            setShowSelectAccount(true);
        }
        setAccounts(mappedAccounts);
    },[]);

    const createAPIInstance = useCallback(async (): Promise<void> => {
        console.log("createAPIInstance  111111111111");
        try {
            window.relayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
            dispatch(isStakedRelayerLoaded(true));

            window.vaultClient = new VaultClient(constants.VAULT_CLIENT_URL);
            dispatch(isVaultClientLoaded(true));

            setTimeout(() => {
                if (!window.polkaBTC) {
                    toast.warn(
                        "Unable to connect to the BTC-Parachain. " +
                        "Please check your internet connection or try again later."
                    );
                }
            }, 5000);
            if(!polkaBtcLoaded) {
                window.polkaBTC = await connectToParachain();
                dispatch(isPolkaBtcLoaded(true));
                setIsLoading(false);
            }
        } catch (error) {
            if (!window.polkaBTC)
                toast.warn(
                    "Unable to connect to the BTC-Parachain. " +
                    "Please check your internet connection or try again later."
                );
        }
    },[]);

    const initDataOnAppBootstrap = useCallback(async (): Promise<void> => {
        if (!polkaBtcLoaded) return;

        const totalPolkaSAT = await window.polkaBTC.treasury.totalPolkaBTC();
        const totalLockedPLANCK = await window.polkaBTC.collateral.totalLockedDOT();
        const totalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
        const totalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();
        dispatch(setTotalIssuedAndTotalLockedAction(totalPolkaBTC, totalLockedDOT));
    },[])

    useEffect(() => {
        // Do not load data if showing static landing page only
        if (!constants.STATIC_PAGE_ONLY) {
            const loadData = async () => {
                    try {
                        setTimeout(()=> {
                            if(isLoading)
                                setIsLoading(false);
                        },3000);
                        await createAPIInstance();
                        initDataOnAppBootstrap();
                        keyring.loadAll({});
                    } catch (e) {
                        console.log("error =>>>>>>>>>>",e.toString());
                        toast.warn("Could not connect to the Parachain, please try again in a few seconds", {
                            autoClose: false,
                        });
                    }

                    await getAccount();
            }
            loadData();
        }
    },[createAPIInstance, getAccount, initDataOnAppBootstrap, isLoading]);

    console.log("Render app.tsx 0000000000000000000000000")

    return <React.Fragment>
        <Router>
            {!isLoading ?
            <div className="main d-flex flex-column min-vh-100 polkabtc-background fade-in-animation">
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                {/* <WalletModal show={showWalletModal} onClose={closeWalletModal}/> */}
                {!constants.STATIC_PAGE_ONLY && (
                    <Topbar
                        address={address}
                        onAccountClick={() => setShowSelectAccount(true)}
                        requestDOT={requestDotFromFaucet}
                    />
                )}
                <Switch>
                    {!constants.STATIC_PAGE_ONLY && (
                        <Route path="/issue">
                            <IssuePage />
                        </Route>
                    )}
                    {!constants.STATIC_PAGE_ONLY && (
                        <Route path="/redeem">
                            <RedeemPage />
                        </Route>
                    )}
                    {!constants.STATIC_PAGE_ONLY && (
                        <Route path="/staked-relayer">
                            <StakedRelayerPage />
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
                    <Route path="/user-guide">
                        <UserGuidePage />
                    </Route>
                    <Route path="/about">
                        <AboutPage />
                    </Route>
                    <Route path="/faq">
                        <FaqPage />
                    </Route>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                </Switch>
                <Footer />
            </div> : 
            <div className="main-loader">
                <img src={loadingImg} alt="loading animation"></img>
            </div>}   
        </Router>
        <Modal show={showSelectAccount} onHide={() => setShowSelectAccount(false)} size={"lg"}>
            <AccountSelector
                selected={address}
                accounts={accounts}
                onSelected={selectAccount}
            ></AccountSelector>
        </Modal>
    </React.Fragment>;
}
