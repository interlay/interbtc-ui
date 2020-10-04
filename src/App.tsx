import React, { Component } from "react";
import { createLogger } from "redux-logger";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { toast, ToastContainer } from "react-toastify";
import { createPolkabtcAPI, StakedRelayerClient } from "@interlay/polkabtc";

import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

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
import Footer from "./common/components/footer";
import LandingPage from "./pages/landing.page";
import IssuePage from "./pages/issue/issue.page";
import VaultPage from "./pages/vault.page";
import RedeemPage from "./pages/redeem/redeem.page";
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import Storage from "./common/controllers/storage";
import { addStorageInstace } from "./common/actions/storage.actions";

const storeLogger = createLogger();
const store = createStore(rootReducer, applyMiddleware(storeLogger));

export default class App extends Component<{}, AppState> {
    state: AppState = {
        account: undefined,
        address: undefined,
        signer: undefined,
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

        // TODO: allow user to pick account
        const { address } = allAccounts[0];
        const { signer } = await web3FromAddress(address);

        this.setState({ signer: signer, address });
    }

    async createAPIInstace() {
        const polkaBTC = await createPolkabtcAPI(constants.PARACHAIN_URL);
        if (this.state.account) {
            polkaBTC.setAccount(this.state.account);
        }
        if (this.state.address && this.state.signer) {
            polkaBTC.setAccount(this.state.address, this.state.signer);
        }
        store.dispatch(addPolkaBtcInstance(polkaBTC));

        const stakedRelayer = new StakedRelayerClient(constants.STAKED_RELAYER_URL);
        store.dispatch(addStakedRelayerInstance(stakedRelayer));
    }

    createStorage(address?: string) {
        const storage = new Storage(address);
        store.dispatch(addStorageInstace(storage));
    }

    componentDidMount(): void {
        this.getAccount().then(() => {
            this.createStorage(this.state.address);
            this.createAPIInstace();
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="main d-flex flex-column min-vh-100">
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                        <Topbar address={this.state.address} account={this.state.account} />
                        <div className="mb-5">
                            <Switch>
                                <Route exact path="/">
                                    <LandingPage/>
                                </Route>
                                <Route path="/issue">
                                    <IssuePage />
                                </Route>
                                <Route path="/vault">
                                    <VaultPage {...this.state} />
                                </Route>
                                <Route path="/redeem">
                                    <RedeemPage />
                                </Route>
                                <Route path="/staked-relayer">
                                    <StakedRelayerPage />
                                </Route>
                            </Switch>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </Provider>
        );
    }
}
