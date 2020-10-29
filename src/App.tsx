import React, { Component } from "react";
import { planckToDOT, satToBTC } from "@interlay/polkabtc";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { createPolkabtcAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { Modal } from "react-bootstrap";
import Big from "big.js";

import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

import AccountSelector from "./pages/account-selector";
import { 
    isPolkaBtcLoaded, 
    isStakedRelayerLoaded, 
    changeAddressAction, 
    setTotalIssuedAndTotalLockedAction 
} from "./common/actions/general.actions";
import * as constants from "./constants";

// theme
// FIXME: Clean-up and move to scss
import "./_general.scss";
import "react-toastify/dist/ReactToastify.css";

// types
import AppState from "./common/types/app.types";

// app imports
import Topbar from "./common/components/topbar";
import Footer from "./common/components/footer/footer";
import LandingPage from "./pages/landing/landing.page";
import IssuePage from "./pages/issue/issue.page";
import VaultPage from "./pages/vault.page";
import RedeemPage from "./pages/redeem/redeem.page";
import AboutPage from "./pages/about.page";
import DashboardPage from "./pages/dashboard/dashboard.page";
import VaultDashboardPage from "./pages/vault-dashboard/vault-dashboard.page";
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import { configureStore } from "./store";

const store = configureStore();

export default class App extends Component<{}, AppState> {
    state: AppState = {
        accounts: undefined,
        address: undefined,
        signer: undefined,
        showSelectAccount: false,
    };

    async getAccount(): Promise<void> {
        if (this.state.address) {
            return;
        }
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

        const accounts = allAccounts.map(({ address }) => address);
        const currentAddress = store.getState().general.address;

        let address: string | undefined = undefined;
        if (currentAddress && accounts.includes(currentAddress)) {
            address = currentAddress;
        } else if (allAccounts.length === 1) {
            address = allAccounts[0].address;
        }

        if (address) {
            this.setState({ accounts });
            this.selectAccount(address);
        } else {
            this.setState({ accounts, showSelectAccount: true });
        }
    }

    async createAPIInstace(): Promise<void> {
        window.relayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
        store.dispatch(isStakedRelayerLoaded(true));
        
        window.polkaBTC = await createPolkabtcAPI(constants.PARACHAIN_URL);
        
        store.dispatch(isPolkaBtcLoaded(true));
    }

    async initDataOnAppBootstrap(): Promise<void> {
        const totalPolkaSAT = await window.polkaBTC.treasury.totalPolkaBTC();
        const totalLockedPLANCK = await window.polkaBTC.collateral.totalLockedDOT();
        const totalPolkaBTC = new Big(satToBTC(totalPolkaSAT.toString())).round(3).toString();
        const totalLockedDOT = new Big(planckToDOT(totalLockedPLANCK.toString())).round(3).toString();
        store.dispatch(setTotalIssuedAndTotalLockedAction(totalPolkaBTC,totalLockedDOT));
    }

    async componentDidMount(): Promise<void> {
        // Do not load data if showing static landing page only
        if (!constants.STATIC_PAGE_ONLY) {
            try {
                await this.createAPIInstace();
                this.initDataOnAppBootstrap();
            } catch (e) {
                toast.warn("Could not connect to the Parachain, please try again in a few seconds", {
                    autoClose: false,
                });
            }

            await this.getAccount();
        }
    }

    async selectAccount(address: string): Promise<void> {
        const polkaBtcLoaded = store.getState().general.polkaBtcLoaded;
        if (!polkaBtcLoaded) {
            return;
        }

        const { signer } = await web3FromAddress(address);
        window.polkaBTC.setAccount(address, signer);
        this.setState({ address, showSelectAccount: false });

        store.dispatch(isPolkaBtcLoaded(true));
        store.dispatch(changeAddressAction(address));
    }


    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="main d-flex flex-column min-vh-100">
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                        {!constants.STATIC_PAGE_ONLY && (
                            <Topbar
                                address={this.state.address}
                                onAccountClick={() => this.setState({ showSelectAccount: true })}
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
                                <Route path="/vault">
                                    <VaultPage {...this.state} />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/dashboard">
                                    <DashboardPage />
                                </Route>
                            )}
                            {!constants.STATIC_PAGE_ONLY && (
                                <Route path="/vault-dashboard">
                                    <VaultDashboardPage/>
                                </Route>
                            )}
                            <Route exact path="/">
                                <LandingPage />
                            </Route>
                            <Route path="/about">
                                <AboutPage />
                            </Route>
                        </Switch>
                        <Footer />
                    </div>
                </Router>
                <Modal show={this.state.showSelectAccount} size={"lg"}>
                    <AccountSelector
                        selected={this.state.address}
                        accounts={this.state.accounts}
                        onSelected={this.selectAccount.bind(this)}
                    ></AccountSelector>
                </Modal>
            </Provider>
        );
    }
}
