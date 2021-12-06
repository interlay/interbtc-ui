import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import LineChart from '../../LineChart';
import Stats, {
  StatsDt,
  StatsDd,
  StatsRouterLink
} from '../../Stats';
import DashboardCard from '../DashboardCard';
import ErrorFallback from 'components/ErrorFallback';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  INTERLAY_DENIM,
  KINTSUGI_SUNDOWN
} from 'utils/constants/colors';
import { PAGES } from 'utils/constants/links';
import graphqlFetcher, {
  GraphqlReturn,
  GRAPHQL_FETCHER
} from 'services/fetchers/graphql-fetcher';
import { getLastMidnightTimestamps } from 'common/utils/utils';

interface Props {
  hasLinks?: boolean;
}

interface VaultRegistration {
  id: string;
  timestamp: number;
}

const ActiveVaultsCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    isIdle: vaultsIdle,
    isLoading: vaultsLoading,
    data: vaults,
    error: vaultsError
  } = useQuery<GraphqlReturn<Array<VaultRegistration>>, Error>(
    [
      GRAPHQL_FETCHER,
      `query {
        vaults(orderBy: registrationTimestamp_ASC) {
          id
          registrationTimestamp
        }
      }`
    ],
    graphqlFetcher<Array<VaultRegistration>>()
  );
  useErrorHandler(vaultsError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (vaultsIdle || vaultsLoading) {
      return <>Loading...</>;
    }
    if (vaults === undefined) {
      throw new Error('Something went wrong!');
    }

    const vaultRegistrations = vaults.data.vaults;
    const graphTimestamps = getLastMidnightTimestamps(5, true);
    const graphData = graphTimestamps.map(
      timestamp => vaultRegistrations.filter(
        registration => registration.timestamp <= timestamp
      ).length
    );

    let chartLineColor;
    if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
      chartLineColor = INTERLAY_DENIM[500];
    // MEMO: should check dark mode as well
    } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
      chartLineColor = KINTSUGI_SUNDOWN[500];
    } else {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <Stats
          leftPart={
            <>
              <StatsDt>
                {t('dashboard.vault.active_vaults')}
              </StatsDt>
              <StatsDd>
                {vaultRegistrations.length}
              </StatsDd>
            </>
          }
          rightPart={
            <>
              {hasLinks && (
                <StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>
                  View vaults
                </StatsRouterLink>
              )}
            </>
          } />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_vaults_chart')]}
          yLabels={graphTimestamps.map(date => new Date(date).toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[graphData]} />
      </>
    );
  };

  return (
    <DashboardCard>
      {renderContent()}
    </DashboardCard>
  );
};

export default withErrorBoundary(ActiveVaultsCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
