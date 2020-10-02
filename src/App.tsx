import React, { Component } from "react";
import { createLogger } from "redux-logger";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { ToastContainer } from "react-toastify";
import { createPolkabtcAPI, StakedRelayerClient } from "@interlay/polkabtc";

import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

import { rootReducer } from "./common/reducers/index";
import { addPolkaBtcInstance, addStakedRelayerInstance } from "./common/actions/api.actions";
import * as constants from "./constants";

// theme
import "./_general.scss";
import "./assets/css/custom-bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/custom.css";

// types
import AppState from "./common/types/AppState";

// app imports
import Topbar from "./common/components/Topbar";
import Footer from "./common/components/Footer";
import { BTCParachain } from "./common/controllers/BTCParachain";
import LandingPage from "./pages/landing.page";
import IssuePage from "./pages/issue.page";
import VaultPage from "./pages/vault.page";
import RedeemPage from "./pages/redeem.page";
import StakedRelayerPage from "./pages/staked-relayer/staked-relayer.page";
import Storage from "./common/controllers/Storage";

// Mocking
import {
    MockIssueRequests,
    MockRedeemRequests,
    totalPolkaBTC,
    totalLockedDOT,
    balancePolkaBTC,
    balanceDOT,
    balanceLockedDOT,
    backedPolkaBTC,
    collateralRate,
    feesEarned,
} from "./mock";
import KVStorage from "./common/controllers/KVStorage";
import { StorageInterface } from "./common/types/Storage";

const storeLogger = createLogger();
const store = createStore(rootReducer, applyMiddleware(storeLogger));

export default class App extends Component<{}, AppState> {
    state: AppState = {
        parachain: new BTCParachain(),
        account: undefined,
        address: undefined,
        signer: undefined,
        vault: false,
        storage: undefined,
        kvstorage: new KVStorage(),
    };

    async initParachain(): Promise<void> {
        await this.state.parachain.connect();
        this.setState({ parachain: this.state.parachain });
    }

    async getAccount(): Promise<void> {
        await web3Enable(constants.APP_NAME);

        const allAccounts = await web3Accounts();
        if (allAccounts.length === 0) {
            return;
        }

        // TODO: allow user to pick account
        const { address } = allAccounts[0];
        const { signer } = await web3FromAddress(address);

        this.setState({ signer: signer, address });
    }

    // FIXME: check if vault server is running
    getVault() {
        this.setState({
            vault: true,
        });
    }

    async getStorage() {
        if (!this.state.address) {
            await this.getAccount();
        }
        if (this.state.address) {
            localStorage.clear();
            let storage = new Storage(this.state.address);
            // for mocking load mock data into storage
            this.mockStorage(storage);
            this.setState({
                storage: storage,
            });
        }
    }

    mockStorage(storage: StorageInterface) {
        if (storage) {
            for (let i = 0; i < MockIssueRequests.length; i++) {
                storage.appendIssueRequest(MockIssueRequests[i]);
            }
            for (let i = 0; i < MockRedeemRequests.length; i++) {
                storage.appendRedeemRequest(MockRedeemRequests[i]);
            }
        }
        if (this.state.kvstorage) {
            this.state.kvstorage.setValue("totalPolkaBTC", totalPolkaBTC);
            this.state.kvstorage.setValue("totalLockedDOT", totalLockedDOT);
            this.state.kvstorage.setValue("balancePolkaBTC", balancePolkaBTC);
            this.state.kvstorage.setValue("balanceDOT", balanceDOT);
            this.state.kvstorage.setValue("balanceLockedDOT", balanceLockedDOT);
            this.state.kvstorage.setValue("backedPolkaBTC", backedPolkaBTC);
            this.state.kvstorage.setValue("collateralRate", collateralRate);
            this.state.kvstorage.setValue("feesEarned", feesEarned);
        }
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

    componentDidMount() {
        this.initParachain();
        this.getAccount();
        this.getVault();
        this.getStorage();
        this.createAPIInstace();
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
                                    <LandingPage {...this.state} />
                                </Route>
                                <Route path="/issue">
                                    <IssuePage {...this.state} />
                                </Route>
                                <Route path="/vault">
                                    <VaultPage {...this.state} />
                                </Route>
                                <Route path="/redeem">
                                    <RedeemPage {...this.state} />
                                </Route>
                                <Route path="/staked-relayer">
                                    <StakedRelayerPage></StakedRelayerPage>
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
