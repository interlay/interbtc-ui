import React, { Component } from "react";
import { createLogger } from "redux-logger";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { toast, ToastContainer } from "react-toastify";
import { createPolkabtcAPI, StakedRelayerClient } from "@interlay/polkabtc";
import { Modal } from "react-bootstrap";

import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

import AccountSelector from "./pages/account-selector";
import { rootReducer } from "./common/reducers/index";
import { addPolkaBtcInstance, addStakedRelayerInstance } from "./common/actions/api.actions";
import * as constants from "./constants";

// theme
// FIXME: Clean-up and move to scss
import "./_general.scss";
import "./assets/css/custom-bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/custom.css";

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
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import { setUser } from "./common/utils/storage";

const storeLogger = createLogger();
const store = createStore(rootReducer, applyMiddleware(storeLogger));

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
        const currentAddress = store.getState().storage.retrieveUserAddress();

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
        const polkaBTC = await createPolkabtcAPI(constants.PARACHAIN_URL);
        store.dispatch(addPolkaBtcInstance(polkaBTC));

        const stakedRelayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
        store.dispatch(addStakedRelayerInstance(stakedRelayer));
    }

    async componentDidMount(): Promise<void> {
        // Do not load data if showing static landing page only
        if (!constants.REACT_APP_STATIC_PAGE_ONLY) {
            try {
                await this.createAPIInstace();
            } catch (e) {
                toast.warn("Could not connect to the Parachain, please try again in a few seconds", {
                    autoClose: false,
                });
            }

            await this.getAccount();
        }
    }

    async selectAccount(address: string): Promise<void> {
        const polkaBTC = store.getState().api;
        if (!polkaBTC) {
            return;
        }

        const { signer } = await web3FromAddress(address);
        polkaBTC.setAccount(address, signer);
        this.setState({ address, showSelectAccount: false });

        store.dispatch(addPolkaBtcInstance(polkaBTC));
        setUser(address, store.getState().storage, store.dispatch);
    }


    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="main d-flex flex-column min-vh-100">
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                        <Topbar
                            address={this.state.address}
                            onAccountClick={() => this.setState({ showSelectAccount: true })}
                        />
                        <Switch>
                            {!constants.REACT_APP_STATIC_PAGE_ONLY && 
                            <React.Fragment>
                                <Route path="/issue">
                                    <IssuePage />
                                </Route>
                                <Route path="/redeem">
                                    <RedeemPage />
                                </Route>
                                <Route path="/staked-relayer">
                                    <StakedRelayerPage />
                                </Route>       
                                <Route path="/vault">
                                    <VaultPage {...this.state} />
                                </Route>
                            </React.Fragment>
                            }
                            <Route path="/">
                                <LandingPage />
                            </Route>
                            <Route path="/about">
                                <AboutPage />
                            </Route>
                        </Switch>
                        <Footer />
                    </div>
                </Router>
                <Modal show={this.state.showSelectAccount}>
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
