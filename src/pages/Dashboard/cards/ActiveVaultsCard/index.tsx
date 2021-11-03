
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { VaultCountTimeData } from '@interlay/interbtc-index-client';

import LineChartComponent from '../../components/line-chart-component';
import DashboardCard from '../DashboardCard';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { PAGES } from 'utils/constants/links';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  linkButton?: boolean;
}

const ActiveVaultsCard = ({ linkButton }: Props): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: totalVaultsPerDayIdle,
    isLoading: totalVaultsPerDayLoading,
    data: totalVaultsPerDay,
    error: totalVaultsPerDayError
  } = useQuery<Array<VaultCountTimeData>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getRecentDailyVaultCounts',
      {}
    ],
    genericFetcher<Array<VaultCountTimeData>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalVaultsPerDayError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (totalVaultsPerDayIdle || totalVaultsPerDayLoading) {
      return <>Loading...</>;
    }
    if (totalVaultsPerDay === undefined) {
      throw new Error('Something went wrong!');
    }

    return (
      <>
        <div
          className={clsx(
            'flex',
            'justify-between',
            'items-center'
          )}>
          <div>
            <h1
              className={clsx(
                // ray test touch <<
                'text-interlayDenim',
                // ray test touch >>
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
              {totalVaultsPerDay[totalVaultsPerDay.length - 1]?.count}
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
          yLabels={totalVaultsPerDay.map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={{ beginAtZero: true, precision: 0 }}
          data={totalVaultsPerDay.map(dataPoint => dataPoint.count)} />
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
