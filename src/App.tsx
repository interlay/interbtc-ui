
import * as React from 'react';
import {
  Switch,
  Route,
  Redirect
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
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import { Keyring } from '@polkadot/api';
import { createInterbtc } from '@interlay/interbtc';
import {
  FaucetClient,
  CollateralUnit
} from '@interlay/interbtc-api';
import { StatusCode } from '@interlay/interbtc-api/build/src/interfaces';
import {
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';

import Layout from 'parts/Layout';
import FullLoadingSpinner from 'components/FullLoadingSpinner';
// TODO: block for now
// import TransitionWrapper from 'parts/TransitionWrapper';
import ErrorFallback from 'components/ErrorFallback';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  WrappedTokenAmount
} from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import './i18n';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import {
  StoreType,
  ParachainStatus,
  StoreState
} from 'common/types/util.types';
import {
  isPolkaBtcLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  isFaucetLoaded,
  isVaultClientLoaded,
  updateWrappedTokenBalanceAction,
  updateCollateralTokenBalanceAction
} from 'common/actions/general.actions';
// TODO: should clean up
import './_general.scss';
import 'react-toastify/dist/ReactToastify.css';

const Bridge = React.lazy(() =>
  import(/* webpackChunkName: 'bridge' */ 'pages/Bridge')
);
const Transactions = React.lazy(() =>
  import(/* webpackChunkName: 'transactions' */ 'pages/Transactions')
);
const Staking = React.lazy(() =>
  import(/* webpackChunkName: 'staking' */ 'pages/Staking')
);
const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: 'dashboard' */ 'pages/Dashboard')
);
// ray test touch <
// TODO: nested routing
const Vaults = React.lazy(() =>
  import(/* webpackChunkName: 'vaults' */ 'pages/Dashboard/Vaults')
);
const IssueRequests = React.lazy(() =>
  import(/* webpackChunkName: 'issue' */ 'pages/Dashboard/IssueRequests')
);
const RedeemRequests = React.lazy(() =>
  import(/* webpackChunkName: 'redeem' */ 'pages/Dashboard/RedeemRequests')
);
const BTCRelay = React.lazy(() =>
  import(/* webpackChunkName: 'relay' */ 'pages/Dashboard/BTCRelay')
);
const Oracles = React.lazy(() =>
  import(/* webpackChunkName: 'oracles' */ 'pages/Dashboard/Oracles')
);
const Parachain = React.lazy(() =>
  import(/* webpackChunkName: 'parachain' */ 'pages/Dashboard/Parachain')
);
// ray test touch >
const VaultDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'vault' */ 'pages/vault-dashboard/vault-dashboard.page')
);
const Feedback = React.lazy(() =>
  import(/* webpackChunkName: 'feedback' */ 'pages/Feedback')
);
const NoMatch = React.lazy(() =>
  import(/* webpackChunkName: 'no-match' */ 'pages/NoMatch')
);

const App = (): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    collateralTokenBalance,
    vaultClientLoaded
  } = useSelector((state: StoreType) => state.general);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const store: StoreState = useStore();

  // Load the main interBTC API - connection to the interBTC bridge
  const loadPolkaBTC = React.useCallback(async (): Promise<void> => {
    try {
      window.bridge = await createInterbtc(
        constants.PARACHAIN_URL,
        constants.BITCOIN_NETWORK,
        WRAPPED_TOKEN,
        constants.STATS_URL
      );
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
    if (!bridgeLoaded) return;
    if (!address) return;

    const id = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);

    // Maybe load the vault client - only if the current address is also registered as a vault
    (async () => {
      try {
        dispatch(isVaultClientLoaded(false));
        const vault = await window.bridge.interBtcApi.vaults.get(id);
        dispatch(isVaultClientLoaded(!!vault));
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect 1] error => ', error);
      }
    })();
  }, [
    bridgeLoaded,
    address,
    dispatch
  ]);

  React.useEffect(() => {
    if (!bridgeLoaded) return;

    // Initialize data on app bootstrap
    (async () => {
      try {
        const [
          totalWrappedTokenAmount,
          totalLockedCollateralTokenAmount,
          btcRelayHeight,
          bitcoinHeight,
          state
        ] = await Promise.all([
          window.bridge.interBtcApi.tokens.total(WRAPPED_TOKEN),
          window.bridge.interBtcApi.tokens.total(COLLATERAL_TOKEN),
          window.bridge.interBtcApi.btcRelay.getLatestBlockHeight(),
          window.bridge.interBtcApi.electrsAPI.getLatestBlockHeight(),
          window.bridge.interBtcApi.system.getStatusCode()
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
            totalWrappedTokenAmount,
            totalLockedCollateralTokenAmount,
            Number(btcRelayHeight),
            bitcoinHeight,
            parachainStatus(state)
          )
        );
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect 2] error.message => ', error.message);
      }
    })();
  }, [
    dispatch,
    bridgeLoaded
  ]);

  // Loads the address for the currently select account and maybe loads the vault and staked relayer dashboards
  React.useEffect(() => {
    if (!bridgeLoaded) return;

    const trySetDefaultAccount = () => {
      if (constants.DEFAULT_ACCOUNT_SEED) {
        const keyring = new Keyring({ type: 'sr25519' });
        const defaultAccountKeyring = keyring.addFromUri(constants.DEFAULT_ACCOUNT_SEED);
        window.bridge.interBtcApi.setAccount(defaultAccountKeyring);
        dispatch(changeAddressAction(defaultAccountKeyring.address));
      }
    };

    (async () => {
      try {
        const theExtensions = await web3Enable(APP_NAME);
        if (theExtensions.length === 0) {
          trySetDefaultAccount();
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
        window.bridge.interBtcApi.setAccount(newAddress, signer);
        dispatch(changeAddressAction(newAddress));
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect 3] error.message => ', error.message);
      }
    })();
  }, [
    address,
    bridgeLoaded,
    dispatch
  ]);

  // Loads the interBTC bridge and the faucet
  React.useEffect(() => {
    if (bridgeLoaded) return;

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
    bridgeLoaded,
    dispatch,
    store
  ]);

  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;
    if (!address) return;

    let unsubscribeFromCollateral: () => void;
    let unsubscribeFromWrapped: () => void;
    (async () => {
      try {
        unsubscribeFromCollateral =
          await window.bridge.interBtcApi.tokens.subscribeToBalance(
            COLLATERAL_TOKEN,
            address,
            (_, balance: MonetaryAmount<Currency<CollateralUnit>, CollateralUnit>) => {
              if (!balance.eq(collateralTokenBalance)) {
                dispatch(updateCollateralTokenBalanceAction(balance));
              }
            }
          );
      } catch (error) {
        console.log('[App React.useEffect 4] error.message => ', error.message);
      }
    })();

    (async () => {
      try {
        unsubscribeFromWrapped =
          await window.bridge.interBtcApi.tokens.subscribeToBalance(
            WRAPPED_TOKEN,
            address,
            (_, balance: WrappedTokenAmount) => {
              if (!balance.eq(wrappedTokenBalance)) {
                dispatch(updateWrappedTokenBalanceAction(balance));
              }
            }
          );
      } catch (error) {
        console.log('[App React.useEffect 5] error.message => ', error.message);
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
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    collateralTokenBalance
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
            <React.Suspense
              fallback={
                <FullLoadingSpinner />
              }>
              <Switch location={location}>
                <Route path={PAGES.FEEDBACK}>
                  <Feedback />
                </Route>
                {vaultClientLoaded && (
                  <Route path={PAGES.VAULT}>
                    <VaultDashboard />
                  </Route>
                )}
                <Route path={PAGES.DASHBOARD_VAULTS}>
                  <Vaults />
                </Route>
                <Route path={PAGES.DASHBOARD_PARACHAIN}>
                  <Parachain />
                </Route>
                <Route path={PAGES.DASHBOARD_ORACLES}>
                  <Oracles />
                </Route>
                <Route path={PAGES.DASHBOARD_ISSUE_REQUESTS}>
                  <IssueRequests />
                </Route>
                <Route path={PAGES.DASHBOARD_REDEEM_REQUESTS}>
                  <RedeemRequests />
                </Route>
                <Route path={PAGES.DASHBOARD_RELAY}>
                  <BTCRelay />
                </Route>
                <Route path={PAGES.DASHBOARD}>
                  <Dashboard />
                </Route>
                <Route path={PAGES.STAKING}>
                  <Staking />
                </Route>
                <Route path={PAGES.TRANSACTIONS}>
                  <Transactions />
                </Route>
                <Route path={PAGES.BRIDGE}>
                  <Bridge />
                </Route>
                <Redirect
                  exact
                  from={PAGES.HOME}
                  to={PAGES.BRIDGE} />
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
};

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
