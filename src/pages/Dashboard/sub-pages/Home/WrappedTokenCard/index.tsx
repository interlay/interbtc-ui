
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { BitcoinAmount } from '@interlay/monetary-js';

import DashboardCard from 'pages/Dashboard/cards/DashboardCard';
import LineChart from 'pages/Dashboard/LineChart';
import ErrorFallback from 'components/ErrorFallback';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// TODO: duplicated
// TODO: should be imported
interface BTCTimeData {
  date: Date;
  btc: BitcoinAmount;
}

const WrappedTokenCard = (): JSX.Element => {
  const {
    prices,
    totalWrappedTokenAmount,
    bridgeLoaded
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: cumulativeIssuesPerDayIdle,
    isLoading: cumulativeIssuesPerDayLoading,
    data: cumulativeIssuesPerDay,
    error: cumulativeIssuesPerDayError
  } = useQuery<Array<BTCTimeData>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getRecentDailyIssues',
      { daysBack: 6 }
    ],
    genericFetcher<Array<BTCTimeData>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(cumulativeIssuesPerDayError);

  const renderContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeIssuesPerDayIdle || cumulativeIssuesPerDayLoading) {
      return <>Loading...</>;
    }
    if (cumulativeIssuesPerDay === undefined) {
      throw new Error('Something went wrong!');
    }

    const converted = cumulativeIssuesPerDay.map(item => ({
      date: item.date.getTime(),
      sat: Number(item.btc.str.Satoshi())
    }));

    const pointIssuesPerDay = converted.map((dataPoint, i) => {
      if (i === 0) {
        return 0;
      } else {
        return dataPoint.sat - converted[i - 1].sat;
      }
    });

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
              {t('dashboard.issue.issued')}
            </h1>
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              {t('dashboard.issue.total_interbtc', {
                amount: displayMonetaryAmount(totalWrappedTokenAmount),
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })}
            </h2>
            {/* TODO: add the price API */}
            <h2
              className={clsx(
                'text-base',
                'font-bold',
                'mb-1'
              )}>
              ${getUsdAmount(totalWrappedTokenAmount, prices.bitcoin.usd)}
            </h2>
          </div>
          <div style={{ display: 'grid', gridRowGap: 10 }}>
            <InterlayRouterLink to={PAGES.DASHBOARD_ISSUE_REQUESTS}>
              <InterlayDenimOutlinedButton
                endIcon={<FaExternalLinkAlt />}
                className='w-full'>
                VIEW ALL ISSUED
              </InterlayDenimOutlinedButton>
            </InterlayRouterLink>
            <InterlayRouterLink to={PAGES.DASHBOARD_REDEEM_REQUESTS}>
              <InterlayCaliforniaOutlinedButton
                endIcon={<FaExternalLinkAlt />}
                className='w-full'>
                VIEW ALL REDEEMED
              </InterlayCaliforniaOutlinedButton>
            </InterlayRouterLink>
          </div>
        </div>
        <div className='mt-5'>
          <LineChart
            color={['d_interlayCalifornia', 'd_interlayPaleSky']}
            label={[
              t('dashboard.issue.total_issued_chart', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              }),
              t('dashboard.issue.per_day_issued_chart', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })
            ]}
            yLabels={converted
              .slice(1)
              .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))
            }
            yAxisProps={[
              { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
              { position: 'right', maxTicksLimit: 6 }
            ]}
            data={[
              converted.slice(1).map(
                dataPoint => Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())
              ),
              pointIssuesPerDay.slice(1).map(sat => Number(BitcoinAmount.from.Satoshi(sat).str.BTC()))
            ]} />
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

export default withErrorBoundary(WrappedTokenCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
