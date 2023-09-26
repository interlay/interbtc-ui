import './i18n';

import { Keyring } from '@polkadot/keyring';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { isVaultClientLoaded } from '@/common/actions/general.actions';
import { StoreType } from '@/common/types/util.types';
import { Layout, TransactionModal } from '@/components';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { useSubstrate, useSubstrateSecureState } from '@/lib/substrate';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import vaultsByAccountIdQuery from '@/services/queries/vaults-by-accountId-query';
import { PAGES } from '@/utils/constants/links';

import * as constants from './constants';
import { FeatureFlags, useFeatureFlag } from './hooks/use-feature-flag';

const BTC = React.lazy(() => import(/* webpackChunkName: 'btc' */ '@/pages/BTC'));
const Strategies = React.lazy(() => import(/* webpackChunkName: 'strategies' */ '@/pages/Strategies'));
const Strategy = React.lazy(() => import(/* webpackChunkName: 'strategy' */ '@/pages/Strategies/Strategy'));
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
                  <>
                    <Route exact path={PAGES.STRATEGIES}>
                      <Strategies />
                    </Route>
                    <Route path={PAGES.STRATEGY}>
                      <Strategy />
                    </Route>
                  </>
                )}
                {isOnboardingEnabled && (
                  <Route path={PAGES.ONBOARDING}>
                    <Onboarding />
                  </Route>
                )}
                <Route path={PAGES.ACTIONS}>
                  <Actions />
                </Route>
                <Route exact path={PAGES.HOME}>
                  <Redirect to={PAGES.WALLET} />
                </Route>
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
