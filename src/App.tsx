import 'react-toastify/dist/ReactToastify.css';
import './i18n';

import { ChainBalance, FaucetClient, SecurityStatusCode } from '@interlay/interbtc-api';
import { Keyring } from '@polkadot/api';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  initGeneralDataAction,
  isFaucetLoaded,
  isVaultClientLoaded,
  updateCollateralTokenBalanceAction,
  updateCollateralTokenTransferableBalanceAction,
  updateWrappedTokenBalanceAction,
  updateWrappedTokenTransferableBalanceAction
} from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import ErrorFallback from '@/components/ErrorFallback';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import Layout from '@/parts/Layout';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { useGovernanceTokenBalanceInvalidate } from '@/services/hooks/use-token-balance';
import vaultsByAccountIdQuery from '@/services/queries/vaults-by-accountId-query';
// ray test touch <
import { _KeyringPair, useSubstrate, useSubstrateSecureState } from '@/substrate-lib/substrate-context';
// ray test touch >
import { BitcoinNetwork } from '@/types/bitcoin';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';
import { CLASS_NAMES } from '@/utils/constants/styles';

import * as constants from './constants';

const Bridge = React.lazy(() => import(/* webpackChunkName: 'bridge' */ '@/pages/Bridge'));
const Transfer = React.lazy(() => import(/* webpackChunkName: 'transfer' */ '@/pages/Transfer'));
const Transactions = React.lazy(() => import(/* webpackChunkName: 'transactions' */ '@/pages/Transactions'));
const TX = React.lazy(() => import(/* webpackChunkName: 'tx' */ '@/pages/TX'));
const Staking = React.lazy(() => import(/* webpackChunkName: 'staking' */ '@/pages/Staking'));
const Dashboard = React.lazy(() => import(/* webpackChunkName: 'dashboard' */ '@/pages/Dashboard'));
const Vaults = React.lazy(() => import(/* webpackChunkName: 'vaults' */ '@/pages/Vaults'));
// TODO: last task will be to delete legacy dashboard and rename vault dashboard
const Vault = React.lazy(() => import(/* webpackChunkName: 'vault' */ '@/pages/Vaults/Vault'));
const NoMatch = React.lazy(() => import(/* webpackChunkName: 'no-match' */ '@/pages/NoMatch'));

type UnsubscriptionRef = (() => void) | null;

const App = (): JSX.Element => {
  const { selectedAccount, extensions } = useSubstrateSecureState();
  const { setSelectedAccount } = useSubstrate();

  const {
    bridgeLoaded,
    wrappedTokenBalance,
    wrappedTokenTransferableBalance,
    collateralTokenBalance,
    collateralTokenTransferableBalance
  } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

  const unsubscribeCollateralTokenBalance = React.useRef<UnsubscriptionRef>(null);
  const unsubscribeWrappedTokenBalance = React.useRef<UnsubscriptionRef>(null);
  const unsubscribeGovernanceTokenBalance = React.useRef<UnsubscriptionRef>(null);

  // Loads the connection to the faucet - only for testnet purposes
  const loadFaucet = React.useCallback(async (): Promise<void> => {
    try {
      window.faucet = new FaucetClient(window.bridge.api, constants.FAUCET_URL);
      dispatch(isFaucetLoaded(true));
    } catch (error) {
      console.log('[loadFaucet] error.message => ', error.message);
    }
  }, [dispatch]);

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
  }, [bridgeLoaded, loadFaucet]);

  // Detects if connected account is vault operator.
  const { error: vaultsError } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, vaultsByAccountIdQuery(selectedAccount?.address ?? '')],
    graphqlFetcher<GraphqlReturn<string[]>>(),
    {
      enabled: bridgeLoaded && !!selectedAccount,
      onSuccess: ({ data: { vaults } }) => {
        const isVaultOperator = vaults.length > 0;
        dispatch(isVaultClientLoaded(isVaultOperator));
      },
      onError: (error) => console.log('[App useQuery 1] error.message => ', error.message)
    }
  );
  useErrorHandler(vaultsError);

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
          window.bridge.tokens.total(RELAY_CHAIN_NATIVE_TOKEN),
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
            btcRelayHeight,
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

  React.useEffect(() => {
    if (!setSelectedAccount) return;

    if (extensions.length === 0) {
      if (constants.DEFAULT_ACCOUNT_SEED) {
        const keyring = new Keyring({ type: 'sr25519', ss58Format: constants.SS58_FORMAT });
        const defaultAccount = keyring.addFromUri(constants.DEFAULT_ACCOUNT_SEED as string);
        setSelectedAccount(defaultAccount as _KeyringPair);
      }
    }
  }, [setSelectedAccount, extensions.length]);

  // Subscribes to relay-chain native token balance
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;
    if (!selectedAccount) return;

    (async () => {
      try {
        const unsubscribe = await window.bridge.tokens.subscribeToBalance(
          RELAY_CHAIN_NATIVE_TOKEN,
          selectedAccount.address,
          (_: string, balance: ChainBalance) => {
            if (!balance.free.eq(collateralTokenBalance)) {
              dispatch(updateCollateralTokenBalanceAction(balance.free));
            }
            if (!balance.transferable.eq(collateralTokenTransferableBalance)) {
              dispatch(updateCollateralTokenTransferableBalanceAction(balance.transferable));
            }
          }
        );

        if (unsubscribeCollateralTokenBalance.current) {
          unsubscribeCollateralTokenBalance.current();
        }
        // Unsubscribe if previous subscription is alive
        unsubscribeCollateralTokenBalance.current = unsubscribe;
      } catch (error) {
        console.log('[App React.useEffect 4] error.message => ', error.message);
      }
    })();

    return () => {
      if (unsubscribeCollateralTokenBalance.current) {
        unsubscribeCollateralTokenBalance.current();
        unsubscribeCollateralTokenBalance.current = null;
      }
    };
  }, [dispatch, bridgeLoaded, selectedAccount, collateralTokenBalance, collateralTokenTransferableBalance]);

  // Subscribes to wrapped token balance
  React.useEffect(() => {
    if (!dispatch) return;
    if (!bridgeLoaded) return;
    if (!selectedAccount) return;

    (async () => {
      try {
        const unsubscribe = await window.bridge.tokens.subscribeToBalance(
          WRAPPED_TOKEN,
          selectedAccount.address,
          (_: string, balance: ChainBalance) => {
            if (!balance.free.eq(wrappedTokenBalance)) {
              dispatch(updateWrappedTokenBalanceAction(balance.free));
            }
            if (!balance.transferable.eq(wrappedTokenTransferableBalance)) {
              dispatch(updateWrappedTokenTransferableBalanceAction(balance.transferable));
            }
          }
        );
        // Unsubscribe if previous subscription is alive
        if (unsubscribeWrappedTokenBalance.current) {
          unsubscribeWrappedTokenBalance.current();
        }

        unsubscribeWrappedTokenBalance.current = unsubscribe;
      } catch (error) {
        console.log('[App React.useEffect 5] error.message => ', error.message);
      }
    })();

    return () => {
      if (unsubscribeWrappedTokenBalance.current) {
        unsubscribeWrappedTokenBalance.current();
        unsubscribeWrappedTokenBalance.current = null;
      }
    };
  }, [dispatch, bridgeLoaded, selectedAccount, wrappedTokenBalance, wrappedTokenTransferableBalance]);

  const governanceTokenBalanceInvalidate = useGovernanceTokenBalanceInvalidate();

  // Subscribes to governance token balance
  React.useEffect(() => {
    if (!bridgeLoaded) return;
    if (!selectedAccount) return;
    if (!governanceTokenBalanceInvalidate) return;

    (async () => {
      try {
        const unsubscribe = await window.bridge.tokens.subscribeToBalance(
          GOVERNANCE_TOKEN,
          selectedAccount.address,
          // TODO: it looks like the callback is called just before the balance is updated (not after)
          () => {
            governanceTokenBalanceInvalidate();
          }
        );
        // Unsubscribe if previous subscription is alive
        if (unsubscribeGovernanceTokenBalance.current) {
          unsubscribeGovernanceTokenBalance.current();
        }

        unsubscribeGovernanceTokenBalance.current = unsubscribe;
      } catch (error) {
        console.log('[App React.useEffect 6] error.message => ', error.message);
      }
    })();

    return () => {
      if (unsubscribeGovernanceTokenBalance.current) {
        unsubscribeGovernanceTokenBalance.current();
        unsubscribeGovernanceTokenBalance.current = null;
      }
    };
  }, [bridgeLoaded, selectedAccount, governanceTokenBalanceInvalidate]);

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

  return (
    <>
      <Layout>
        <Route
          render={({ location }) => (
            <React.Suspense fallback={<FullLoadingSpinner />}>
              {bridgeLoaded ? (
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
                  <Route path={PAGES.TX}>
                    <TX />
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
              ) : (
                <FullLoadingSpinner />
              )}
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
