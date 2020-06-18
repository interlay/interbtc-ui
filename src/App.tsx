import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// theme
import './App.scss';
import './assets/css/custom-bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/custom.css';

// types
import AppState from './types/AppState';

// app imports
// import Topbar from "./components/Topbar";
import LandingPage from './views/LandingPage';
import IssuePage from './views/IssuePage';
import Footer from './components/Footer';
import { BTCParachain } from './controllers/BTCParachain';
import { ALICE } from './constants';
import VaultPage from './views/VaultPage';
import RedeemPage from './views/RedeemPage';

export default class App extends Component<{}, AppState> {
  state: AppState = {
    parachain: new BTCParachain(),
    account: undefined,
    balancePolkaBTC: "0.7"
  }

  async initParachain() {
    await this.state.parachain.connect();
    this.setState({
      parachain: this.state.parachain,
    });
  }

  // FIXME: integrate with a wallet
  getAccount() {
    const account = ALICE;
    this.setState({
      account: account
    })
  }

  componentDidMount() {
    this.initParachain();
    this.getAccount();
  }

  render() {
    return (
      <Router>
        <div className="main d-flex flex-column min-vh-100">
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
