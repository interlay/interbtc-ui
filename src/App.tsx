import './i18n';

import { Keyring } from '@polkadot/keyring';
import * as React from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat';

import { isVaultClientLoaded } from '@/common/actions/general.actions';
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

  const dispatch = useDispatch();
  const isStrategiesEnabled = useFeatureFlag(FeatureFlags.STRATEGIES);
  const isOnboardingEnabled = useFeatureFlag(FeatureFlags.ONBOARDING);

  // Detects if the connected account is a vault operator
  const { error: vaultsError } = useQuery<GraphqlReturn<any>, Error>(
    [GRAPHQL_FETCHER, vaultsByAccountIdQuery(selectedAccount?.address ?? '')],
    graphqlFetcher<GraphqlReturn<string[]>>(),
    {
      enabled: process.env.NODE_ENV !== 'test' && !!selectedAccount,
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
      <React.Suspense fallback={<FullLoadingSpinner />}>
        <Routes>
          <Route path={PAGES.HOME} element={<Navigate to={PAGES.WALLET} />} />
          <Route path={PAGES.VAULTS} element={<Vaults />} />
          <Route path={PAGES.VAULT} element={<Vault />} />
          <Route path={PAGES.VAULT} element={<Vaults />} />
          <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
          <Route path={PAGES.STAKING} element={<Staking />} />
          <Route path={PAGES.TX} element={<TX />} />
          <Route path={PAGES.BTC} element={<BTC />} />
          <Route path={PAGES.SEND_AND_RECEIVE} element={<SendAndReceive />} />
          <Route path={PAGES.LOANS} element={<Loans />} />
          <Route path={PAGES.SWAP} element={<Swap />} />
          <Route path={PAGES.POOLS} element={<Pools />} />
          <Route path={PAGES.WALLET} element={<Wallet />} />
          {isStrategiesEnabled && (
            <Route path={PAGES.STRATEGIES} element={<Strategies />}>
              <Route path={PAGES.STRATEGY} element={<Strategy />} />
            </Route>
          )}
          {isOnboardingEnabled && <Route path={PAGES.ONBOARDING} element={<Onboarding />} />}
          <Route path={PAGES.ACTIONS} element={<Actions />} />
          <Route path='*' element={<NoMatch />} />
        </Routes>
      </React.Suspense>
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
