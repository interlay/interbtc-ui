import './i18n';

import { FaucetClient } from '@interlay/interbtc-api';
import { Keyring } from '@polkadot/keyring';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { isFaucetLoaded, isVaultClientLoaded } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import vaultsByAccountIdQuery from '@/services/queries/vaults-by-accountId-query';
import { BitcoinNetwork } from '@/types/bitcoin';
import { PAGES } from '@/utils/constants/links';

import { Layout, TransactionModal } from './components';
import * as constants from './constants';
import { FeatureFlags, useFeatureFlag } from './hooks/use-feature-flag';
import TestnetBanner from './legacy-components/TestnetBanner';

const BTC = React.lazy(() => import(/* webpackChunkName: 'btc' */ '@/pages/BTC'));
const Strategies = React.lazy(() => import(/* webpackChunkName: 'strategies' */ '@/pages/Strategies'));
const SendAndReceive = React.lazy(() => import(/* webpackChunkName: 'sendAndReceive' */ '@/pages/SendAndReceive'));
const TX = React.lazy(() => import(/* webpackChunkName: 'tx' */ '@/pages/TX'));
const Staking = React.lazy(() => import(/* webpackChunkName: 'staking' */ '@/pages/Staking'));
const Dashboard = React.lazy(() => import(/* webpackChunkName: 'dashboard' */ '@/pages/Dashboard'));
const Vaults = React.lazy(() => import(/* webpackChunkName: 'vaults' */ '@/pages/Vaults'));
// TODO: last task will be to delete legacy dashboard and rename vault dashboard
const Vault = React.lazy(() => import(/* webpackChunkName: 'vault' */ '@/pages/Vaults/Vault'));
const Loans = React.lazy(() => import(/* webpackChunkName: 'loans' */ '@/pages/Loans'));
const Swap = React.lazy(() => import(/* webpackChunkName: 'amm' */ '@/pages/Swap'));
const Pools = React.lazy(() => import(/* webpackChunkName: 'amm/pools' */ '@/pages/Pools'));
const Wallet = React.lazy(() => import(/* webpackChunkName: 'wallet' */ '@/pages/Wallet'));
const Onboarding = React.lazy(() => import(/* webpackChunkName: 'onboarding' */ '@/pages/Onboarding'));
const Actions = React.lazy(() => import(/* webpackChunkName: 'actions' */ '@/pages/Actions'));
const NoMatch = React.lazy(() => import(/* webpackChunkName: 'no-match' */ '@/pages/NoMatch'));

const App = (): JSX.Element => {
  const { selectedAccount, extensions } = useSubstrateSecureState();
  const { setSelectedAccount } = useSubstrate();

  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const dispatch = useDispatch();
  const isStrategiesEnabled = useFeatureFlag(FeatureFlags.STRATEGIES);
  const isOnboardingEnabled = useFeatureFlag(FeatureFlags.ONBOARDING);

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
    // if (process.env.REACT_APP_BITCOIN_NETWORK === BitcoinNetwork.Mainnet) return;

    (async () => {
      try {
        await loadFaucet();
      } catch (error) {
        console.log('[App React.useEffect 8] error.message => ', error.message);
      }
    })();
  }, [bridgeLoaded, loadFaucet]);

  // Detects if the connected account is a vault operator
  const { error: vaultsError } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, vaultsByAccountIdQuery(selectedAccount?.address ?? '')],
    graphqlFetcher<GraphqlReturn<string[]>>(),
    {
      enabled: process.env.NODE_ENV !== 'test' && bridgeLoaded && !!selectedAccount,
      onSuccess: ({ data }) => {
        const isVaultOperator = data?.vaults.length > 0;
        dispatch(isVaultClientLoaded(isVaultOperator));
      },
      onError: (error) => {
        console.log('[App useQuery 1] error.message => ', error.message);
      }
    }
  );
  useErrorHandler(vaultsError);

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

  return (
    <Layout>
      {process.env.REACT_APP_BITCOIN_NETWORK === BitcoinNetwork.Testnet && <TestnetBanner />}
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
                <Route path={PAGES.TX}>
                  <TX />
                </Route>
                <Route path={PAGES.BTC}>
                  <BTC />
                </Route>
                <Route path={PAGES.SEND_AND_RECEIVE}>
                  <SendAndReceive />
                </Route>
                <Route path={PAGES.LOANS}>
                  <Loans />
                </Route>
                <Route path={PAGES.SWAP}>
                  <Swap />
                </Route>
                <Route path={PAGES.POOLS}>
                  <Pools />
                </Route>
                <Route path={PAGES.WALLET}>
                  <Wallet />
                </Route>
                {isStrategiesEnabled && (
                  <Route path={PAGES.STRATEGIES}>
                    <Strategies />
                  </Route>
                )}
                {isOnboardingEnabled && (
                  <Route path={PAGES.ONBOARDING}>
                    <Onboarding />
                  </Route>
                )}
                <Route path={PAGES.ACTIONS}>
                  <Actions />
                </Route>
                <Redirect exact from={PAGES.HOME} to={PAGES.WALLET} />
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
      <TransactionModal />
    </Layout>
  );
};

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
