import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import LineChartComponent from './line-chart-component';
import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { PAGES } from 'utils/constants/links';
import graphqlFetcher, { GraphqlReturn, GRAPHQL_FETCHER } from 'services/fetchers/graphql-fetcher';
import { useQuery } from 'react-query';
import { useErrorHandler } from 'react-error-boundary';
import EllipsisLoader from 'components/EllipsisLoader';
import { getLastMidnightTimestamps } from 'common/utils/utils';

interface Props {
  linkButton?: boolean;
}

interface VaultRegistration {
  id: string;
  timestamp: number;
}

const ActiveVaults = ({ linkButton }: Props): JSX.Element => {
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
        vaultRegistrations(orderBy: timestamp_ASC) {
          id
          timestamp
        }
      }
      `
    ],
    graphqlFetcher<Array<VaultRegistration>>()
  );
  useErrorHandler(vaultsError);

  if (
    vaultsIdle ||
    vaultsLoading
  ) {
    return (
      <div
        className={clsx(
          'flex',
          'justify-center'
        )}>
        <EllipsisLoader dotClassName='bg-interlayCalifornia-400' />
      </div>
    );
  }
  if (!vaultsData) {
    throw new Error('Something went wrong!');
  }

  const vaultRegistrations = vaultsData.data.vaultRegistrations;
  const graphTimestamps = getLastMidnightTimestamps(5, true);
  const graphData = graphTimestamps.map(
    timestamp => vaultRegistrations.filter(
      registration => registration.timestamp <= timestamp
    ).length
  );

  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          <h1
            className={clsx(
              'text-interlayDenim',
              'text-sm',
              'xl:text-base',
              'mb-1',
              'xl:mb-2'
            )}>
            {t('dashboard.vault.active_vaults')}
          </h1>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            {vaultRegistrations.length}
          </h2>
        </div>
        {linkButton && (
          <InterlayRouterLink to={PAGES.DASHBOARD_VAULTS}>
            <InterlayDenimOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW ALL VAULTS
            </InterlayDenimOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <LineChartComponent
        color='d_interlayDenim'
        label={t('dashboard.vault.total_vaults_chart') as string}
        yLabels={graphTimestamps.map(date => new Date(date).toISOString().substring(0, 10))}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={graphData} />
    </DashboardCard>
  );
};

export default ActiveVaults;
