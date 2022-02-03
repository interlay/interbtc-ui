
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
  tickerToCurrencyIdLiteral,
  SecurityStatusCode,
  FaucetClient,
  ChainBalance,
  CollateralUnit,
  GovernanceUnit
} from '@interlay/interbtc-api';
import { createInterbtc } from '@interlay/interbtc';
import { BitcoinUnit } from '@interlay/monetary-js';

import InterlayHelmet from 'parts/InterlayHelmet';
import Layout from 'parts/Layout';
import FullLoadingSpinner from 'components/FullLoadingSpinner';
import ErrorFallback from 'components/ErrorFallback';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN
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
  isPolkaBtcLoaded,
  changeAddressAction,
  initGeneralDataAction,
  setInstalledExtensionAction,
  isFaucetLoaded,
  isVaultClientLoaded,
  updateWrappedTokenBalanceAction,
  updateWrappedTokenTransferableBalanceAction,
  updateCollateralTokenBalanceAction,
  updateCollateralTokenTransferableBalanceAction,
  updateGovernanceTokenBalanceAction,
  updateGovernanceTokenTransferableBalanceAction
} from 'common/actions/general.actions';
import 'react-toastify/dist/ReactToastify.css';

const Bridge = React.lazy(() =>
  import(/* webpackChunkName: 'bridge' */ 'pages/Bridge')
);
const Transfer = React.lazy(() =>
  import(/* webpackChunkName: 'transfer' */ 'pages/Transfer')
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
const Vault = React.lazy(() =>
  import(/* webpackChunkName: 'vault' */ 'pages/Vault')
);
const NoMatch = React.lazy(() =>
  import(/* webpackChunkName: 'no-match' */ 'pages/NoMatch')
);

const App = (): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    collateralTokenBalance,
    collateralTokenTransferableBalance,
    governanceTokenBalance,
    governanceTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const store: StoreState = useStore();

  // Load the main bridge API - connection to the bridge
  const loadPolkaBTC = React.useCallback(async (): Promise<void> => {
    try {
      window.bridge = await createInterbtc(
        constants.PARACHAIN_URL,
        constants.BITCOIN_NETWORK,
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
      window.faucet = new FaucetClient(window.bridge.interBtcApi.api, constants.FAUCET_URL);
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
        const vault = await window.bridge.interBtcApi.vaults.get(
          id,
          tickerToCurrencyIdLiteral(COLLATERAL_TOKEN.ticker)
        );
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
          totalGovernanceTokenAmount,
          btcRelayHeight,
          bitcoinHeight,
          state
        ] = await Promise.all([
          window.bridge.interBtcApi.tokens.total(WRAPPED_TOKEN),
          window.bridge.interBtcApi.tokens.total(COLLATERAL_TOKEN),
          window.bridge.interBtcApi.tokens.total(GOVERNANCE_TOKEN),
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
            totalGovernanceTokenAmount,
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

  // Loads the address for the currently select account and maybe loads the vault dashboard
  React.useEffect(() => {
    if (!bridgeLoaded) return;

    const trySetDefaultAccount = () => {
      if (constants.DEFAULT_ACCOUNT_SEED) {
        const keyring = new Keyring({ type: 'sr25519', ss58Format: constants.SS58_FORMAT });
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

        const accounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
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

  // Loads the bridge and the faucet
  React.useEffect(() => {
    if (bridgeLoaded) return;

    (async () => {
      try {
        // TODO: should avoid any race condition
        setTimeout(() => {
          if (isLoading) setIsLoading(false);
        }, 3000);
        await loadPolkaBTC();
        // Only load faucet on testnet
        if (process.env.REACT_APP_BITCOIN_NETWORK !== 'mainnet') {
          await loadFaucet();
        }
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
    let unsubscribeFromGovernance: () => void;

    (async () => {
      try {
        unsubscribeFromCollateral =
          await window.bridge.interBtcApi.tokens.subscribeToBalance(
            COLLATERAL_TOKEN,
            address,
            (_: string, balance: ChainBalance<CollateralUnit>) => {
              if (!balance.free.eq(collateralTokenBalance)) {
                dispatch(updateCollateralTokenBalanceAction(balance.free));
              }
              if (!balance.transferable.eq(collateralTokenTransferableBalance)) {
                dispatch(updateCollateralTokenTransferableBalanceAction(balance.transferable));
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
            (_: string, balance: ChainBalance<BitcoinUnit>) => {
              if (!balance.free.eq(wrappedTokenBalance)) {
                dispatch(updateWrappedTokenBalanceAction(balance.free));
              }
              if (!balance.transferable.eq(wrappedTokenTransferableBalance)) {
                dispatch(updateWrappedTokenTransferableBalanceAction(balance.transferable));
              }
            }
          );
      } catch (error) {
        console.log('[App React.useEffect 5] error.message => ', error.message);
      }
    })();

    (async () => {
      try {
        unsubscribeFromGovernance =
          await window.bridge.interBtcApi.tokens.subscribeToBalance(
            GOVERNANCE_TOKEN,
            address,
            (_: string, balance: ChainBalance<GovernanceUnit>) => {
              if (!balance.free.eq(governanceTokenBalance)) {
                dispatch(updateGovernanceTokenBalanceAction(balance.free));
              }
              if (!balance.transferable.eq(governanceTokenTransferableBalance)) {
                dispatch(updateGovernanceTokenTransferableBalanceAction(balance.transferable));
              }
            }
          );
      } catch (error) {
        console.log('[App React.useEffect 4] error.message => ', error.message);
      }
    })();

    return () => {
      if (unsubscribeFromCollateral) {
        unsubscribeFromCollateral();
      }
      if (unsubscribeFromWrapped) {
        unsubscribeFromWrapped();
      }
      if (unsubscribeFromGovernance) {
        unsubscribeFromGovernance();
      }
    };
  }, [
    dispatch,
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    collateralTokenBalance,
    collateralTokenTransferableBalance,
    governanceTokenBalance,
    governanceTokenTransferableBalance
  ]);

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
                <Route path={PAGES.VAULT}>
                  <Vault />
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
                <Route path={PAGES.TRANSFER}>
                  <Transfer />
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
    </>
  );
};

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
