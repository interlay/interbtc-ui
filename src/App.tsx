import 'react-toastify/dist/ReactToastify.css';
import './i18n';

import { FaucetClient, SecurityStatusCode } from '@interlay/interbtc-api';
import { Keyring } from '@polkadot/keyring';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { initGeneralDataAction, isFaucetLoaded, isVaultClientLoaded } from '@/common/actions/general.actions';
import { ParachainStatus, StoreType } from '@/common/types/util.types';
import ErrorFallback from '@/components/ErrorFallback';
import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import { GOVERNANCE_TOKEN, RELAY_CHAIN_NATIVE_TOKEN, WRAPPED_TOKEN } from '@/config/relay-chains';
import { useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import Layout from '@/parts/Layout';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import vaultsByAccountIdQuery from '@/services/queries/vaults-by-accountId-query';
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

const App = (): JSX.Element => {
  const { selectedAccount, extensions } = useSubstrateSecureState();
  const { setSelectedAccount } = useSubstrate();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();

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
        setSelectedAccount(defaultAccount);
      }
    }
  }, [setSelectedAccount, extensions.length]);

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
