import * as React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import {
  toast,
  ToastContainer
} from 'react-toastify';
import {
  useSelector,
  useDispatch,
  useStore
} from 'react-redux';
import { withErrorBoundary } from 'react-error-boundary';
import Big from 'big.js';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import {
  FaucetClient,
  createInterbtcAPI,
  InterBTCAPI,
  CurrencyIdLiteral
} from '@interlay/interbtc';
import { StatusCode } from '@interlay/interbtc/build/interfaces';
import { Keyring } from '@polkadot/api';

import Layout from 'parts/Layout';
import Home from 'pages/Home';
import Dashboard from 'pages/dashboard/dashboard.page';
import VaultDashboard from 'pages/vault-dashboard/vault-dashboard.page';
import VaultsDashboard from 'pages/dashboard/vaults/vaults.dashboard.page';
import IssueRequests from 'pages/dashboard/IssueRequests';
import RedeemRequests from 'pages/dashboard/RedeemRequests';
import RelayDashboard from 'pages/dashboard/relay/relay.dashboard.page';
import OraclesDashboard from 'pages/dashboard/oracles/oracles.dashboard.page';
import ParachainDashboard from 'pages/dashboard/parachain/parachain.dashboard.page';
// TODO: block for now
// import TransitionWrapper from 'parts/TransitionWrapper';
import ErrorFallback from 'components/ErrorFallback';
import {
  APP_NAME,
  ACCOUNT_ID_TYPE_NAME
} from 'config/general';
import { PAGES } from 'utils/constants/links';
import './i18n';
import {
  displayBtcAmount,
  displayDotAmount
} from 'common/utils/utils';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  isPolkaBtcLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  isFaucetLoaded,
  isVaultClientLoaded,
  updateBalancePolkaBTCAction,
  updateBalanceDOTAction
} from 'common/actions/general.actions';
// TODO: should clean up
import './_general.scss';
import 'react-toastify/dist/ReactToastify.css';

// TODO: block code-splitting for now
// const Home = React.lazy(() =>
//   import(/* webpackChunkName: 'application' */ 'pages/Home')
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

function connectToParachain(): Promise<InterBTCAPI> {
  return createInterbtcAPI(
    constants.PARACHAIN_URL,
    constants.BITCOIN_NETWORK
  );
}

function App(): JSX.Element {
  const {
    polkaBtcLoaded,
    address,
    balancePolkaBTC,
    balanceDOT
  } = useSelector((state: StoreType) => state.general);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const store = useStore();

  // Load the main InterBTC API - connection to the InterBTC bridge
  const loadPolkaBTC = React.useCallback(async (): Promise<void> => {
    try {
      window.polkaBTC = await connectToParachain();
      dispatch(isPolkaBtcLoaded(true));
      setIsLoading(false);
    } catch (error) {
      toast.warn('Unable to connect to the BTC-Parachain.');
      console.log('[loadPolkaBTC] error.message => ', error.message);
    }

    try {
      startFetchingLiveData(dispatch, store);
    } catch (error) {
      console.log('[loadPolkaBTC] error.message => ', error.message);
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
      console.log('[loadFaucet] error.message => ', error.message);
    }
  }, [dispatch]);

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
        console.log('No InterBTC vault found for the account in the connected Polkadot wallet.');
        console.log('[App React.useEffect] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    address,
    dispatch
  ]);

  React.useEffect(() => {
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
          window.polkaBTC.tokens.total(CurrencyIdLiteral.INTERBTC),
          window.polkaBTC.tokens.total(CurrencyIdLiteral.DOT),
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
            displayBtcAmount(totalPolkaBTC),
            displayDotAmount(totalLockedDOT),
            Number(btcRelayHeight),
            bitcoinHeight,
            parachainStatus(state)
          )
        );
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect] error.message => ', error.message);
      }
    })();
  }, [
    dispatch,
    polkaBtcLoaded
  ]);

  // Loads the address for the currently select account and maybe loads the vault and staked relayer dashboards
  React.useEffect(() => {
    if (!polkaBtcLoaded) return;

    const setDefaultAccount = () => {
      const keyring = new Keyring({ type: 'sr25519' });
      const aliceKeyring = keyring.addFromUri(constants.DEFAULT_ACCOUNT_SEED);
      window.polkaBTC.setAccount(aliceKeyring);
      console.log(`[App React.useEffect] Using default account: ${aliceKeyring.address}`);
      dispatch(changeAddressAction(aliceKeyring.address));
    };

    (async () => {
      try {
        const theExtensions = await web3Enable(APP_NAME);
        if (theExtensions.length === 0) {
          setDefaultAccount();
          return;
        }

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
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect] error.message => ', error.message);
      }
    })();
  }, [
    address,
    polkaBtcLoaded,
    dispatch
  ]);

  // Loads the InterBTC bridge and the faucet
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!dispatch) return;
    if (!polkaBtcLoaded) return;
    if (!address) return;

    let unsubscribeFromCollateral: () => void;
    let unsubscribeFromWrapped: () => void;
    (async () => {
      try {
        unsubscribeFromCollateral =
          await window.polkaBTC.tokens.subscribeToBalance(CurrencyIdLiteral.DOT, address, (_, balance: Big) => {
            const newDOTBalance = balance.toString();
            if (newDOTBalance !== balanceDOT) {
              dispatch(updateBalanceDOTAction(newDOTBalance));
            }
          });
      } catch (error) {
        console.log('[App React.useEffect] error.message => ', error.message);
      }
    })();

    (async () => {
      try {
        unsubscribeFromWrapped =
          await window.polkaBTC.tokens.subscribeToBalance(CurrencyIdLiteral.INTERBTC, address, (_, balance: Big) => {
            const newPolkaBTCBalance = balance.toString();
            if (newPolkaBTCBalance !== balancePolkaBTC) {
              dispatch(updateBalancePolkaBTCAction(newPolkaBTCBalance));
            }
          });
      } catch (error) {
        console.log('[App React.useEffect] error.message => ', error.message);
      }
    })();

    return () => {
      if (unsubscribeFromCollateral) {
        unsubscribeFromCollateral();
      }
      if (unsubscribeFromWrapped) {
        unsubscribeFromWrapped();
      }
    };
  }, [
    dispatch,
    polkaBtcLoaded,
    address,
    balancePolkaBTC,
    balanceDOT
  ]);

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false} />
      <Layout>
        <Route
          render={({ location }) => (
            // TODO: block for now
            // <TransitionWrapper location={location}>
            // TODO: should use loading spinner instead of `Loading...`
            <React.Suspense fallback={<div>Loading...</div>}>
              <Switch location={location}>
                <Route path={PAGES.DASHBOARD_VAULTS}>
                  <VaultsDashboard />
                </Route>
                <Route path={PAGES.CHALLENGES}>
                  <Challenges />
                </Route>
                <Route path={PAGES.DASHBOARD_PARACHAIN}>
                  <ParachainDashboard />
                </Route>
                <Route path={PAGES.DASHBOARD_ORACLES}>
                  <OraclesDashboard />
                </Route>
                <Route path={PAGES.DASHBOARD_ISSUE_REQUESTS}>
                  <IssueRequests />
                </Route>
                <Route path={PAGES.DASHBOARD_REDEEM_REQUESTS}>
                  <RedeemRequests />
                </Route>
                <Route path={PAGES.DASHBOARD_RELAY}>
                  <RelayDashboard />
                </Route>
                <Route path={PAGES.DASHBOARD}>
                  <Dashboard />
                </Route>
                <Route path={PAGES.VAULT}>
                  <VaultDashboard />
                </Route>
                <Route path={PAGES.FEEDBACK}>
                  <Feedback />
                </Route>
                <Route
                  path={PAGES.HOME}
                  exact>
                  <Home />
                </Route>
                <Route path='*'>
                  <NoMatch />
                </Route>
              </Switch>
            </React.Suspense>
            // </TransitionWrapper>
          )} />
      </Layout>
    </>
  );
}

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
