
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { CollateralTimeData } from '@interlay/interbtc-index-client';

import LineChartComponent from '../../components/line-chart-component';
import DashboardCard from '../DashboardCard';
import ErrorFallback from 'components/ErrorFallback';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { COLLATERAL_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

interface Props {
  linkButton?: boolean;
}

const CollateralLockedCard = ({ linkButton }: Props): JSX.Element => {
  const {
    prices,
    totalLockedCollateralTokenAmount,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: cumulativeCollateralPerDayIdle,
    isLoading: cumulativeCollateralPerDayLoading,
    data: cumulativeCollateralPerDay,
    error: cumulativeCollateralPerDayError
  } = useQuery<Array<CollateralTimeData>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getRecentDailyCollateralLocked',
      { daysBack: 6 }
    ],
    genericFetcher<Array<CollateralTimeData>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(cumulativeCollateralPerDayError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeCollateralPerDayIdle || cumulativeCollateralPerDayLoading) {
      return <>Loading...</>;
    }
    if (cumulativeCollateralPerDay === undefined) {
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
              {t('dashboard.vault.locked_collateral')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {displayMonetaryAmount(totalLockedCollateralTokenAmount)} {COLLATERAL_TOKEN_SYMBOL}
            </h2>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              ${getUsdAmount(totalLockedCollateralTokenAmount, prices.collateralToken.usd)}
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
        <div className='mt-5'>
          <LineChartComponent
            color='d_interlayDenim'
            label={t('dashboard.vault.total_collateral_locked') as string}
            yLabels={cumulativeCollateralPerDay
              .slice(1)
              .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
            yAxisProps={[
              { beginAtZero: true, precision: 0 }
            ]}
            data={
              cumulativeCollateralPerDay.slice(1).map(dataPoint => dataPoint.amount)
            } />
        </div>
      </>
    );
  };

  return (
    <DashboardCard>
      {renderContent()}
    </DashboardCard>
  );
};

export default withErrorBoundary(CollateralLockedCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
