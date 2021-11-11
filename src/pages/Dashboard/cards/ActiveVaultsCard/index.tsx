
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
import { PAGES } from 'utils/constants/links';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
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
    data: vaultsData,
    error: vaultsError
  } = useQuery<GraphqlReturn<Array<VaultRegistration>>, Error>(
    [
      GRAPHQL_FETCHER,
      `query {
        vaults(orderBy: registrationTimestamp_ASC) {
          id
          registrationTimestamp
        }
      }
      `
    ],
    graphqlFetcher<Array<VaultRegistration>>()
  );
  useErrorHandler(vaultsError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (vaultsIdle || vaultsLoading) {
      return <>Loading...</>;
    }
    if (vaultsData === undefined) {
      throw new Error('Something went wrong!');
    }

    const vaultRegistrations = vaultsData.data.vaults;
    const graphTimestamps = getLastMidnightTimestamps(5, true);
    const graphData = graphTimestamps.map(
      timestamp => vaultRegistrations.filter(
        registration => registration.timestamp <= timestamp
      ).length
    );

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
          color='d_interlayDenim'
          label={t('dashboard.vault.total_vaults_chart') as string}
          yLabels={graphTimestamps.map(date => new Date(date).toISOString().substring(0, 10))}
          yAxisProps={{ beginAtZero: true, precision: 0 }}
          data={graphData} />
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
