
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { BitcoinAmount } from '@interlay/monetary-js';

import LineChartComponent from '../components/line-chart-component';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import IssueRequestsTable from 'containers/IssueRequestsTable';
import ErrorFallback from 'components/ErrorFallback';
import Hr1 from 'components/hrs/Hr1';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  displayMonetaryAmount,
  getUsdAmount
} from 'common/utils/utils';
import genericFetcher, {
  GENERIC_FETCHER
} from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// TODO: should be imported
interface BTCTimeData {
  date: Date;
  btc: BitcoinAmount;
}

function IssueRequests(): JSX.Element {
  const {
    totalWrappedTokenAmount,
    prices,
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

  const {
    isIdle: totalSuccessfulIssuesIdle,
    isLoading: totalSuccessfulIssuesLoading,
    data: totalSuccessfulIssues,
    error: totalSuccessfulIssuesError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalSuccessfulIssues'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalSuccessfulIssuesError);

  const {
    isIdle: totalIssuesIdle,
    isLoading: totalIssuesLoading,
    data: totalIssues,
    error: totalIssuesError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalIssues'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalIssuesError);

  const renderUpperContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeIssuesPerDayIdle || cumulativeIssuesPerDayLoading) {
      return <>Loading...</>;
    }
    if (totalSuccessfulIssuesIdle || totalSuccessfulIssuesLoading) {
      return <>Loading...</>;
    }
    if (cumulativeIssuesPerDay === undefined) {
      throw new Error('Something went wrong!');
    }

    const converted = cumulativeIssuesPerDay.map(item => ({
      date: item.date.getTime(),
      sat: Number(item.btc.toString())
    }));

    const pointIssuesPerDay = converted.map((dataPoint, i) => {
      if (i === 0) {
        return 0;
      } else {
        return dataPoint.sat - converted[i - 1].sat;
      }
    });

    return (
      <div
        className={clsx(
          'sm:flex',
          'sm:flex-wrap',
          'sm:items-center',
          'sm:justify-center'
        )}>
        <div
          className={clsx(
            'space-y-0.5',
            'font-medium',
            'text-lg',
            'sm:flex-1'
          )}>
          <h5
            className={clsx(
              // ray test touch <<
              'text-interlayDenim',
              // ray test touch >>
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.issue.issued')}
          </h5>
          <h5>
            {t('dashboard.issue.total_interbtc', {
              amount: displayMonetaryAmount(totalWrappedTokenAmount),
              wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
            })}
          </h5>
          <h5
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            ${getUsdAmount(totalWrappedTokenAmount, prices.bitcoin.usd).toLocaleString()}
          </h5>
          <h5
            className={clsx(
              'text-interlayConifer',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.issue.issue_requests')}
          </h5>
          <h5>
            {totalSuccessfulIssues}
          </h5>
        </div>
        <div
          className={clsx(
            'border',
            'rounded',
            'sm:flex-1'
          )}>
          {/* ray test touch < */}
          {/* TODO: create a component */}
          <LineChartComponent
            color={[
              'd_interlayDenim',
              'd_interlayPaleSky'
            ]}
            label={[
              t('dashboard.issue.total_issued_chart', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              }),
              t('dashboard.issue.per_day_issued_chart', {
                wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
              })
            ]}
            yLabels={
              converted
                .slice(1)
                .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))
            }
            yAxisProps={[
              {
                beginAtZero: true,
                position: 'left',
                maxTicksLimit: 6
              },
              {
                position: 'right',
                maxTicksLimit: 6
              }
            ]}
            data={[
              converted
                .slice(1)
                .map(dataPoint => Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())),
              pointIssuesPerDay.slice(1).map(sat => Number(BitcoinAmount.from.Satoshi(sat).str.BTC()))
            ]} />
          {/* ray test touch > */}
        </div>
      </div>
    );
  };

  const renderLowerContent = () => {
    // TODO: should use skeleton loaders
    if (totalIssuesIdle || totalIssuesLoading) {
      return <>Loading...</>;
    }
    if (totalIssues === undefined) {
      throw new Error('Something went wrong!');
    }

    return (
      <IssueRequestsTable totalIssueRequests={totalIssues} />
    );
  };

  return (
    <>
      <div>
        <PageTitle
          mainTitle={t('issue_page.issue_requests')}
          subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      {/* ray test touch < */}
      {/* TODO: create a component */}
      {renderUpperContent()}
      {renderLowerContent()}
      {/* ray test touch > */}
    </>
  );
}

export default withErrorBoundary(IssueRequests, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
