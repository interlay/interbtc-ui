import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// theme
import './_general.scss';
import './assets/css/custom-bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/custom.css';

// types
import AppState from './common/types/AppState';

// app imports
import Topbar from "./common/components/Topbar";
import LandingPage from './pages/LandingPage';
import IssuePage from './pages/IssuePage';
import Footer from './common/components/Footer';
import { BTCParachain } from './common/controllers/BTCParachain';
import VaultPage from './pages/VaultPage';
import RedeemPage from './pages/RedeemPage';
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
  feesEarned
} from "./mock";
import KVStorage from './common/controllers/KVStorage';
import { StorageInterface } from './common/types/Storage';

export default class App extends Component<{}, AppState> {
  state: AppState = {
    parachain: new BTCParachain(),
    account: undefined,
    address: undefined,
    vault: false,
    storage: undefined,
    kvstorage: new KVStorage(),
  }

  async initParachain() {
    await this.state.parachain.connect();
    this.setState({
      parachain: this.state.parachain,
    });
  }

  // FIXME: integrate with a wallet
  async getAccount() {
    if (!this.state.parachain.keyring) {
      await this.initParachain();
    }
    const account = this.state.parachain.keyring?.addFromUri('//Alice');
    const address = account?.address;
    this.setState({
      account: account,
      address: address
    })
  }

  // FIXME: check if vault server is running
  getVault() {
    this.setState({
      vault: true
    })
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
        storage: storage
      })
    }
  }

  mockStorage(storage: StorageInterface) {
    if (storage) {
      for (let i=0; i < MockIssueRequests.length; i++) {
        storage.appendIssueRequest(
          MockIssueRequests[i]
        );
      }
      for (let i=0; i < MockRedeemRequests.length; i++) {
        storage.appendRedeemRequest(
          MockRedeemRequests[i]
        );
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

  componentDidMount() {
    this.initParachain();
    this.getAccount();
    this.getVault();
    this.getStorage();
  }

  render() {
    return (
      <Router>
        <div className="main d-flex flex-column min-vh-100">
          <Topbar {...this.state} />
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
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}
