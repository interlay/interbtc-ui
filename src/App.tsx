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
  useDispatch
} from 'react-redux';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp';
import { Keyring } from '@polkadot/api';
import {
  createInterBtcApi,
  SecurityStatusCode,
  FaucetClient,
  ChainBalance,
  CollateralUnit,
  GovernanceUnit
} from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';
import 'react-toastify/dist/ReactToastify.css';

import InterlayHelmet from 'parts/InterlayHelmet';
import Layout from 'parts/Layout';
import FullLoadingSpinner from 'components/FullLoadingSpinner';
import ErrorFallback from 'components/ErrorFallback';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import {
  APP_NAME,
  WRAPPED_TOKEN,
  COLLATERAL_TOKEN,
  GOVERNANCE_TOKEN,
  PRICES_URL,
  RELAY_CHAIN_NAME,
  BRIDGE_PARACHAIN_NAME
} from 'config/relay-chains';
import { PAGES } from 'utils/constants/links';
import { CLASS_NAMES } from 'utils/constants/styles';
import { POLKADOT, KUSAMA } from 'utils/constants/relay-chain-names';
import { COLLATERAL_TOKEN_ID_LITERAL } from 'utils/constants/currency';
import STATUSES from 'utils/constants/statuses';
import './i18n';
import * as constants from './constants';
import {
  StoreType,
  ParachainStatus
} from 'common/types/util.types';
import {
  isBridgeLoaded,
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
  updateGovernanceTokenTransferableBalanceAction,
  updateOfPricesAction
} from 'common/actions/general.actions';
import { BitcoinNetwork } from 'types/bitcoin';

const Bridge = React.lazy(() => import(/* webpackChunkName: 'bridge' */ 'pages/Bridge'));
const Transfer = React.lazy(() => import(/* webpackChunkName: 'transfer' */ 'pages/Transfer'));
const Transactions = React.lazy(() => import(/* webpackChunkName: 'transactions' */ 'pages/Transactions'));
const Staking = React.lazy(() => import(/* webpackChunkName: 'staking' */ 'pages/Staking'));
const Dashboard = React.lazy(() => import(/* webpackChunkName: 'dashboard' */ 'pages/Dashboard'));
const Vaults = React.lazy(() => import(/* webpackChunkName: 'vaults' */ 'pages/Vaults'));
const Vault = React.lazy(() => import(/* webpackChunkName: 'vault' */ 'pages/Vaults/Vault'));
const NoMatch = React.lazy(() => import(/* webpackChunkName: 'no-match' */ 'pages/NoMatch'));

const App = (): JSX.Element => {
  const {
    bridgeLoaded,
    address,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    collateralTokenBalance,
    collateralTokenTransferableBalance,
    governanceTokenBalance,
    governanceTokenTransferableBalance,
    prices
  } = useSelector((state: StoreType) => state.general);
  // eslint-disable-next-line max-len
  const [bridgeStatus, setBridgeStatus] = React.useState(STATUSES.IDLE); // TODO: `bridgeLoaded` should be based on enum instead of boolean
  const dispatch = useDispatch();

  // Loads the main bridge API - connection to the bridge
  const loadBridge = React.useCallback(async (): Promise<void> => {
    try {
      setBridgeStatus(STATUSES.PENDING);
      window.bridge = await createInterBtcApi(
        constants.PARACHAIN_URL,
        constants.BITCOIN_NETWORK
      );
      dispatch(isBridgeLoaded(true));
      setBridgeStatus(STATUSES.RESOLVED);
    } catch (error) {
      toast.warn('Unable to connect to the BTC-Parachain.');
      console.log('[loadBridge] error.message => ', error.message);
      setBridgeStatus(STATUSES.REJECTED);
    }
  }, [dispatch]);

  // Loads the connection to the faucet - only for testnet purposes
  const loadFaucet = React.useCallback(async (): Promise<void> => {
    try {
      window.faucet = new FaucetClient(window.bridge.api, constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));
    } catch (error) {
      console.log('[loadFaucet] error.message => ', error.message);
    }
  }, [dispatch]);

  // Loads the bridge
  React.useEffect(() => {
    if (bridgeLoaded) return; // Not necessary but for more clarity
    if (bridgeStatus !== STATUSES.IDLE) return;

    (async () => {
      try {
        await loadBridge();
      } catch (error) {
        console.log('[App React.useEffect 7] error.message => ', error.message);
      }
    })();
  }, [
    loadBridge,
    bridgeLoaded,
    bridgeStatus
  ]);

  // Loads the faucet
  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (process.env.REACT_APP_BITCOIN_NETWORK === BitcoinNetwork.Mainnet) return;

    (async () => {
      try {
        await loadFaucet();
      } catch (error) {
        console.log('[App React.useEffect 8] error.message => ', error.message);
      }
    })();
  }, [
    bridgeLoaded,
    loadFaucet
  ]);

  // Maybe loads the vault client - only if the current address is also registered as a vault
  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!address) return;

    const id = window.bridge.api.createType(ACCOUNT_ID_TYPE_NAME, address);

    (async () => {
      try {
        dispatch(isVaultClientLoaded(false));
        const vault = await window.bridge.vaults.get(id, COLLATERAL_TOKEN_ID_LITERAL);
        dispatch(isVaultClientLoaded(!!vault));
      } catch (error) {
        // TODO: should add error handling
        console.log('[App React.useEffect 1] error.message => ', error.message);
      }
    })();
  }, [bridgeLoaded, address, dispatch]);

  // Initializes data on app bootstrap
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;

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
          window.bridge.tokens.total(WRAPPED_TOKEN),
          window.bridge.tokens.total(COLLATERAL_TOKEN),
          window.bridge.tokens.total(GOVERNANCE_TOKEN),
          window.bridge.btcRelay.getLatestBlockHeight(),
          window.bridge.electrsAPI.getLatestBlockHeight(),
          window.bridge.system.getStatusCode()
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
  }, [dispatch, bridgeLoaded]);

  // Loads the address for the currently selected account
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;

    const trySetDefaultAccount = () => {
      if (constants.DEFAULT_ACCOUNT_SEED) {
        const keyring = new Keyring({ type: 'sr25519', ss58Format: constants.SS58_FORMAT });
        const defaultAccountKeyring = keyring.addFromUri(constants.DEFAULT_ACCOUNT_SEED as string);
        window.bridge.setAccount(defaultAccountKeyring);
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

        dispatch(setInstalledExtensionAction(theExtensions.map((extension) => extension.name)));

        // TODO: load accounts just once
        const accounts = await web3Accounts({ ss58Format: constants.SS58_FORMAT });
        const matchedAccount = accounts.find((account) => account.address === address);

        if (matchedAccount) {
          const { signer } = await web3FromAddress(address);
          window.bridge.setAccount(address, signer);
          dispatch(changeAddressAction(address));
        } else {
          dispatch(changeAddressAction(''));
          window.bridge.removeAccount();
        }
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

  // Subscribes to balances
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;
    if (!address) return;

    let unsubscribeFromCollateral: () => void;
    let unsubscribeFromWrapped: () => void;
    let unsubscribeFromGovernance: () => void;

    (async () => {
      try {
        unsubscribeFromCollateral = await window.bridge.tokens.subscribeToBalance(
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
        unsubscribeFromWrapped = await window.bridge.tokens.subscribeToBalance(
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
        unsubscribeFromGovernance = await window.bridge.tokens.subscribeToBalance(
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
        console.log('[App React.useEffect 6] error.message => ', error.message);
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

  // Color schemes according to Interlay vs. Kintsugi
  React.useEffect(() => {
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      document.documentElement.classList.add(CLASS_NAMES.LIGHT);
      document.documentElement.classList.remove(CLASS_NAMES.DARK);
      document.body.classList.add('text-interlayTextPrimaryInLightMode');
      document.body.classList.add('bg-interlayHaiti-50');
      document.body.classList.add('theme-interlay');
    }

    // MEMO: should check dark mode as well
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      // MEMO: inspired by https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
      document.documentElement.classList.add(CLASS_NAMES.DARK);
      document.documentElement.classList.remove(CLASS_NAMES.LIGHT);
      document.body.classList.add('dark:text-kintsugiTextPrimaryInDarkMode');
      document.body.classList.add('dark:bg-kintsugiMidnight-900');
      document.body.classList.add('theme-kintsugi');
    }
  }, []);

  // Keeps fetching live data prices
  const { error: pricesError } = useQuery(
    PRICES_URL,
    async () => {
      const response = await fetch(PRICES_URL);
      if (!response.ok) {
        throw new Error('Network response for prices was not ok.');
      }

      const newPrices = await response.json();
      // Update the store only if the price is actually changed
      if (
        newPrices.bitcoin.usd !== prices.bitcoin.usd ||
        newPrices[RELAY_CHAIN_NAME].usd !== prices.collateralToken.usd ||
        newPrices[BRIDGE_PARACHAIN_NAME].usd !== prices.governanceToken.usd
      ) {
        dispatch(updateOfPricesAction({
          bitcoin: newPrices.bitcoin,
          collateralToken: newPrices[RELAY_CHAIN_NAME],
          governanceToken: newPrices[BRIDGE_PARACHAIN_NAME]
        }));
      }
    },
    { refetchInterval: 60000 }
  );
  useErrorHandler(pricesError);

  return (
    <>
      <InterlayHelmet />
      <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false} />
      <Layout>
        <Route
          render={({ location }) => (
            <React.Suspense fallback={<FullLoadingSpinner />}>
              <Switch location={location}>
                <Route exact path={PAGES.VAULTS}>
                  <Vaults />
                </Route>
                <Route exact path={PAGES.VAULT}>
                  <Vault />
                </Route>
                <Route path={PAGES.VAULT}>
                  <Vaults />
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
                <Redirect exact from={PAGES.HOME} to={PAGES.BRIDGE} />
                <Route path='*'>
                  <NoMatch />
                </Route>
              </Switch>
            </React.Suspense>
          )}
        />
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
