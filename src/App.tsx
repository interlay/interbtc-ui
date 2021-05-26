
import * as React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { matchPath } from 'react-router';
import {
  toast,
  ToastContainer
} from 'react-toastify';
import {
  useSelector,
  useDispatch,
  useStore
} from 'react-redux';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import {
  FaucetClient,
  createPolkabtcAPI,
  PolkaBTCAPI
} from '@interlay/polkabtc';
import { StatusCode } from '@interlay/polkabtc/build/interfaces';
import Big from 'big.js';

import Layout from 'parts/Layout';
import Application from 'pages/Application';
import Dashboard from 'pages/dashboard/dashboard.page';
import VaultDashboard from 'pages/vault-dashboard/vault-dashboard.page';
import StakedRelayer from 'pages/staked-relayer/staked-relayer.page';
import VaultsDashboard from 'pages/dashboard/vaults/vaults.dashboard.page';
import IssueRequests from 'pages/dashboard/IssueRequests';
import RedeemRequests from 'pages/dashboard/RedeemRequests';
import LandingPage from 'pages/landing/landing.page';
import RelayDashboard from 'pages/dashboard/relay/relay.dashboard.page';
import OraclesDashboard from 'pages/dashboard/oracles/oracles.dashboard.page';
import ParachainDashboard from 'pages/dashboard/parachain/parachain.dashboard.page';
// TODO: block for now
// import TransitionWrapper from 'parts/TransitionWrapper';

import LazyLoadingErrorBoundary from 'utils/hocs/LazyLoadingErrorBoundary';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import {
  isPolkaBtcLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  isFaucetLoaded,
  isStakedRelayerLoaded,
  isVaultClientLoaded
} from 'common/actions/general.actions';
import './i18n';
import { APP_NAME } from 'config/general';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
// TODO: should clean up and move to scss
import './_general.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

// TODO: block code-splitting for now
// const Application = React.lazy(() =>
//   import(/* webpackChunkName: 'application' */ 'pages/Application')
// );
// const Dashboard = React.lazy(() =>
//   import(/* webpackChunkName: 'dashboard' */ 'pages/dashboard/dashboard.page')
// );
// const VaultDashboardPage = React.lazy(() =>
//   import(/* webpackChunkName: 'vault' */ 'pages/vault-dashboard/vault-dashboard.page')
// );
// const StakedRelayerPage = React.lazy(() =>
//   import(/* webpackChunkName: 'staked-relayer' */ 'pages/staked-relayer/staked-relayer.page')
// );
const Challenges = React.lazy(() =>
  import(/* webpackChunkName: 'challenges' */ 'pages/Challenges')
);
// const VaultsDashboard = React.lazy(() =>
//   import(/* webpackChunkName: 'vaults' */ 'pages/dashboard/vaults/vaults.dashboard.page')
// );
// const IssueRequests = React.lazy(() =>
//   import(/* webpackChunkName: 'issue' */ 'pages/dashboard/IssueRequests')
// );
// const RedeemRequests = React.lazy(() =>
//   import(/* webpackChunkName: 'redeem' */ 'pages/dashboard/RedeemRequests')
// );
// const LandingPage = React.lazy(() =>
//   import(/* webpackChunkName: 'landing' */ 'pages/landing/landing.page')
// );
// const RelayDashboard = React.lazy(() =>
//   import(/* webpackChunkName: 'relay' */ 'pages/dashboard/relay/relay.dashboard.page')
// );
// const OraclesDashboard = React.lazy(() =>
//   import(/* webpackChunkName: 'oracles' */ 'pages/dashboard/oracles/oracles.dashboard.page')
// );
// const ParachainDashboard = React.lazy(() =>
//   import(/* webpackChunkName: 'parachain' */ 'pages/dashboard/parachain/parachain.dashboard.page')
// );
const Feedback = React.lazy(() =>
  import(/* webpackChunkName: 'feedback' */ 'pages/Feedback')
);
const NoMatch = React.lazy(() =>
  import(/* webpackChunkName: 'no-match' */ 'pages/NoMatch')
);

function connectToParachain(): Promise<PolkaBTCAPI> {
  return createPolkabtcAPI(
    constants.PARACHAIN_URL,
    constants.BITCOIN_NETWORK === 'regtest' ? constants.BITCOIN_REGTEST_URL : constants.BITCOIN_NETWORK
  );
}

function App(): JSX.Element {
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);
  const address = useSelector((state: StoreType) => state.general.address);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const store = useStore();

  // Load the main PolkaBTC API - connection to the PolkaBTC bridge
  const loadPolkaBTC = React.useCallback(async (): Promise<void> => {
    try {
      window.polkaBTC = await connectToParachain();
      dispatch(isPolkaBtcLoaded(true));
      setIsLoading(false);
    } catch (error) {
      toast.warn('Unable to connect to the BTC-Parachain.');
      console.log('Unable to connect to the BTC-Parachain.');
      console.log('error.message => ', error.message);
    }

    try {
      startFetchingLiveData(dispatch, store);
    } catch (error) {
      console.log('Error fetching live data.');
      console.log('error.message => ', error.message);
    }
  }, [
    dispatch,
    store
  ]);

  // Load the connection to the faucet - only for testnet purposes
  const loadFaucet = React.useCallback(async (): Promise<void> => {
    try {
      window.faucet = new FaucetClient(constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));
    } catch (error) {
      console.log('Unable to connect to the faucet.');
      console.log('error.message => ', error.message);
    }
  }, [
    dispatch
  ]);

  React.useEffect(() => {
    if (!polkaBtcLoaded) return;
    if (!address) return;

    const id = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);

    // Maybe load the vault client - only if the current address is also registered as a vault
    (async () => {
      try {
        dispatch(isVaultClientLoaded(false));
        const vault = await window.polkaBTC.vaults.get(id);
        dispatch(isVaultClientLoaded(!!vault));
      } catch (error) {
        // TODO: should add error handling
        console.log('No PolkaBTC vault found for the account in the connected Polkadot wallet.');
        console.log('error.message => ', error.message);
      }
    })();

    // Maybe load the staked relayer client - only if the current address is also registered as a vault
    (async () => {
      try {
        dispatch(isStakedRelayerLoaded(false));
        const stake = await window.polkaBTC.stakedRelayer.getStakedCollateral(id);
        dispatch(isStakedRelayerLoaded(stake > new Big(0)));
      } catch (error) {
        // TODO: should add error handling
        console.log('No PolkaBTC staked relayer found for the account in the connected Polkadot wallet.');
        console.log('error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    address,
    dispatch
  ]);

  React.useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;
    if (!polkaBtcLoaded) return;

    // Initialize data on app bootstrap
    (async () => {
      try {
        const [
          totalPolkaBTC,
          totalLockedDOT,
          btcRelayHeight,
          bitcoinHeight,
          state
        ] = await Promise.all([
          window.polkaBTC.treasury.total(),
          window.polkaBTC.collateral.totalLocked(),
          window.polkaBTC.btcRelay.getLatestBlockHeight(),
          window.polkaBTC.electrsAPI.getLatestBlockHeight(),
          window.polkaBTC.stakedRelayer.getCurrentStateOfBTCParachain()
        ]);

        const parachainStatus = (state: StatusCode) => {
          if (state.isError) {
            return ParachainStatus.Error;
          } else if (state.isRunning) {
            return ParachainStatus.Running;
          } else if (state.isShutdown) {
            return ParachainStatus.Shutdown;
          } else {
            return ParachainStatus.Loading;
          }
        };

        dispatch(
          initGeneralDataAction(
            totalPolkaBTC.round(3).toString(),
            totalLockedDOT.round(3).toString(),
            Number(btcRelayHeight),
            bitcoinHeight,
            parachainStatus(state)
          )
        );
      } catch (error) {
        // TODO: should have error handling instead of console
        console.log(error);
      }
    })();
  }, [
    dispatch,
    polkaBtcLoaded
  ]);

  // Loads the address for the currently select account and maybe loads the vault and staked relayer dashboards
  React.useEffect(() => {
    if (checkStaticPage()) return; // Do not load data if showing static landing page only
    if (!polkaBtcLoaded) return;

    (async () => {
      const theExtensions = await web3Enable(APP_NAME);
      if (theExtensions.length === 0) return;

      dispatch(setInstalledExtensionAction(theExtensions.map(extension => extension.name)));

      const accounts = await web3Accounts();
      if (accounts.length === 0) {
        dispatch(changeAddressAction(''));
        return;
      }

      const matchedAccount = accounts.find(account => account.address === address);
      const newAddress = matchedAccount ? address : accounts[0].address;

      const { signer } = await web3FromAddress(newAddress);
      // TODO: could store the active address just in one place (either in `window` object or in redux)
      window.polkaBTC.setAccount(newAddress, signer);
      dispatch(changeAddressAction(newAddress));
    })();
  }, [
    address,
    polkaBtcLoaded,
    dispatch
  ]);

  // Loads the PolkaBTC bridge and the faucet
  React.useEffect(() => {
    // Do not load data if showing static landing page only
    if (checkStaticPage()) return;
    if (polkaBtcLoaded) return;

    (async () => {
      try {
        // TODO: should avoid any race condition
        setTimeout(() => {
          if (isLoading) setIsLoading(false);
        }, 3000);
        await loadPolkaBTC();
        await loadFaucet();
        keyring.loadAll({});
      } catch (error) {
        console.log(error.message);
      }
    })();
    startFetchingLiveData(dispatch, store);
  }, [
    loadPolkaBTC,
    loadFaucet,
    isLoading,
    polkaBtcLoaded,
    dispatch,
    store
  ]);

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false} />
      <Layout>
        <LazyLoadingErrorBoundary>
          <Route
            render={({ location }) => {
              if (checkStaticPage()) {
                const pageURLs = [
                  PAGES.stakedRelayer,
                  PAGES.vaults,
                  PAGES.challenges,
                  PAGES.parachain,
                  PAGES.oracles,
                  PAGES.issue,
                  PAGES.redeem,
                  PAGES.relay,
                  PAGES.dashboard,
                  PAGES.vault,
                  PAGES.feedback,
                  PAGES.application
                ];

                for (const pageURL of pageURLs) {
                  if (matchPath(location.pathname, { path: pageURL })) {
                    return <Redirect to={PAGES.home} />;
                  }
                }
              }

              return (
                // TODO: block for now
                // <TransitionWrapper location={location}>
                // TODO: should use loading spinner instead of `Loading...`
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Switch location={location}>
                    <Route path={PAGES.stakedRelayer}>
                      <StakedRelayer />
                    </Route>
                    <Route path={PAGES.vaults}>
                      <VaultsDashboard />
                    </Route>
                    <Route path={PAGES.challenges}>
                      <Challenges />
                    </Route>
                    <Route path={PAGES.parachain}>
                      <ParachainDashboard />
                    </Route>
                    <Route path={PAGES.oracles}>
                      <OraclesDashboard />
                    </Route>
                    <Route path={PAGES.issue}>
                      <IssueRequests />
                    </Route>
                    <Route path={PAGES.redeem}>
                      <RedeemRequests />
                    </Route>
                    <Route path={PAGES.relay}>
                      <RelayDashboard />
                    </Route>
                    <Route path={PAGES.dashboard}>
                      <Dashboard />
                    </Route>
                    <Route path={PAGES.vault}>
                      <VaultDashboard />
                    </Route>
                    <Route path={PAGES.feedback}>
                      <Feedback />
                    </Route>
                    <Route
                      exact
                      path={PAGES.application}>
                      <Application />
                    </Route>
                    <Route
                      path={PAGES.home}
                      exact>
                      <LandingPage />
                    </Route>
                    <Route path='*'>
                      <NoMatch />
                    </Route>
                  </Switch>
                </React.Suspense>
                // </TransitionWrapper>
              );
            }} />
        </LazyLoadingErrorBoundary>
      </Layout>
    </>
  );
}

export default App;
