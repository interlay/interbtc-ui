
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
import { Keyring } from '@polkadot/api';
import {
  CollateralCurrency,
  tickerToCurrencyIdLiteral,
  SecurityStatusCode
} from '@interlay/interbtc-api';
import { createInterbtc } from '@interlay/interbtc';
import {
  FaucetClient,
  CollateralUnit
} from '@interlay/interbtc-api';
import {
  MonetaryAmount,
  Currency
} from '@interlay/monetary-js';

import InterlayHelmet from 'parts/InterlayHelmet';
import Layout from 'parts/Layout';
import FullLoadingSpinner from 'components/FullLoadingSpinner';
import ErrorFallback from 'components/ErrorFallback';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  WrappedTokenAmount
} from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import { CLASS_NAMES } from 'utils/constants/styles';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import './i18n';
import * as constants from './constants';
import startFetchingLiveData from 'common/live-data/live-data';
import {
  StoreType,
  ParachainStatus,
  StoreState
} from 'common/types/util.types';
import {
  isBridgeLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  isFaucetLoaded,
  isVaultClientLoaded,
  updateWrappedTokenBalanceAction,
  updateCollateralTokenBalanceAction
} from 'common/actions/general.actions';
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
const VaultDashboard = React.lazy(() =>
  import(/* webpackChunkName: 'vault' */ 'pages/Vault')
);
const NoMatch = React.lazy(() =>
  import(/* webpackChunkName: 'no-match' */ 'pages/NoMatch')
);

const DeveloperConsole = React.lazy(() =>
  import(/* webpackChunkName: 'developer-console' */ 'substrate-lib/components/DeveloperConsole')
);

const App = (): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    collateralTokenBalance,
    vaultClientLoaded
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const store: StoreState = useStore();

  // Load the main bridge API - connection to the bridge
  const loadBridge = React.useCallback(async (): Promise<void> => {
    try {
      window.bridge = await createInterbtc(
        constants.PARACHAIN_URL,
        COLLATERAL_TOKEN as CollateralCurrency,
        WRAPPED_TOKEN,
        constants.BITCOIN_NETWORK,
        constants.STATS_URL
      );
      dispatch(isBridgeLoaded(true));
    } catch (error) {
      toast.warn('Unable to connect to the BTC-Parachain.');
      console.log('[loadBridge 1] error.message => ', error.message);
    }

    try {
      startFetchingLiveData(dispatch, store);
    } catch (error) {
      console.log('[loadBridge 2] error.message => ', error.message);
    }
  }, [
    dispatch,
    store
  ]);

  // Load the connection to the faucet - only for testnet purposes
  const loadFaucet = React.useCallback(async (): Promise<void> => {
    try {
      window.faucet = new FaucetClient(window.bridge.interBtcApi.api, constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));
    } catch (error) {
      console.log('[loadFaucet] error.message => ', error.message);
    }
  }, [dispatch]);

  // Loads the bridge and the faucet
  React.useEffect(() => {
    if (bridgeLoaded) return;

    (async () => {
      try {
        await loadBridge();
        await loadFaucet();
      } catch (error) {
        console.log('[App React.useEffect 6] error.message => ', error.message);
      }
    })();
  }, [
    loadBridge,
    loadFaucet,
    bridgeLoaded
  ]);

  // Maybe load the vault client - only if the current address is also registered as a vault
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;
    if (!address) return;

    const id = window.bridge.polkadotApi.createType(ACCOUNT_ID_TYPE_NAME, address);

    (async () => {
      try {
        dispatch(isVaultClientLoaded(false));
        const vault = await window.bridge.interBtcApi.vaults.get(
          id,
          tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker)
        );
        dispatch(isVaultClientLoaded(!!vault));
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect 1] error.message => ', error.message);
      }
    })();
  }, [
    bridgeLoaded,
    address,
    dispatch
  ]);

  // Initialize data on app bootstrap
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;

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

        const parachainStatus = (state: SecurityStatusCode) => {
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

  // ray test touch <<<
  // Loads the address for the currently select account
  React.useEffect(() => {
    if (!dispatch) return;
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
  // ray test touch >>>

  // Subscribes to balances
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

  // Color schemes according to Interlay vs. Kintsugi
  React.useEffect(() => {
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      document.documentElement.classList.add(CLASS_NAMES.LIGHT);
      document.documentElement.classList.remove(CLASS_NAMES.DARK);
      document.body.classList.add('text-interlayTextPrimaryInLightMode');
      document.body.classList.add('bg-interlayHaiti-50');
    }

    // MEMO: should check dark mode as well
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      // MEMO: inspired by https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
      document.documentElement.classList.add(CLASS_NAMES.DARK);
      document.documentElement.classList.remove(CLASS_NAMES.LIGHT);
      document.body.classList.add('dark:text-kintsugiTextPrimaryInDarkMode');
      document.body.classList.add('dark:bg-kintsugiMidnight-900');
    }
  }, []);

  return (
    <>
      <InterlayHelmet />
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false} />
      <Layout>
        <Route
          render={({ location }) => (
            <React.Suspense fallback={<FullLoadingSpinner />}>
              <Switch location={location}>
                {vaultClientLoaded && (
                  <Route path={PAGES.VAULT}>
                    <VaultDashboard />
                  </Route>
                )}
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
          )} />
      </Layout>
      {process.env.NODE_ENV !== 'production' && (
        <React.Suspense fallback={null}>
          <DeveloperConsole />
        </React.Suspense>
      )}
    </>
  );
};

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
