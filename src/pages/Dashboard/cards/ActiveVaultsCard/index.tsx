import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { formatNumber, getLastMidnightTimestamps } from '@/common/utils/utils';
import { COUNT_OF_DATES_FOR_CHART } from '@/config/charts';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import graphqlFetcher, { GRAPHQL_FETCHER, GraphqlReturn } from '@/services/fetchers/graphql-fetcher';
import { INTERLAY_DENIM, KINTSUGI_SUNDOWN } from '@/utils/constants/colors';
import { PAGES } from '@/utils/constants/links';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

import LineChart from '../../LineChart';
import Stats, { StatsDd, StatsDt, StatsRouterLink } from '../../Stats';
import DashboardCard from '../DashboardCard';

interface Props {
  hasLinks?: boolean;
}

interface VaultRegistration {
  id: string;
  registrationTimestamp: number;
}

const cutoffTimestamps = getLastMidnightTimestamps(COUNT_OF_DATES_FOR_CHART, true);

const ActiveVaultsCard = ({ hasLinks }: Props): JSX.Element => {
  const { t } = useTranslation();

  const { isIdle: vaultsIdle, isLoading: vaultsLoading, data: vaults, error: vaultsError } = useQuery<
    GraphqlReturn<Array<VaultRegistration>>,
    Error
  >(
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
    const graphData = cutoffTimestamps
      .slice(1)
      .map(
        (timestamp) =>
          vaultRegistrations.filter((registration) => new Date(registration.registrationTimestamp) <= timestamp).length
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
              <StatsDt>{t('dashboard.vault.vaults')}</StatsDt>
              <StatsDd>{formatNumber(vaultRegistrations.length)}</StatsDd>
            </>
          }
          rightPart={<>{hasLinks && <StatsRouterLink to={PAGES.DASHBOARD_VAULTS}>View vaults</StatsRouterLink>}</>}
        />
        <LineChart
          wrapperClassName='h-full'
          colors={[chartLineColor]}
          labels={[t('dashboard.vault.total_vaults_chart')]}
          yLabels={cutoffTimestamps.slice(0, -1).map((date) => new Date(date).toISOString().substring(0, 10))}
          yAxes={[
            {
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]}
          datasets={[graphData]}
        />
      </>
    );
  };

  return <DashboardCard>{renderContent()}</DashboardCard>;
};

export default withErrorBoundary(ActiveVaultsCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
