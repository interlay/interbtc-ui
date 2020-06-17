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

export default class App extends Component<{}, AppState> {
  state: AppState = {
    parachain: new BTCParachain(),
    account: undefined
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
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
