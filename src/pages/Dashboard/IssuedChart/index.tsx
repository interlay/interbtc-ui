
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';

import LineChart from '../LineChart';
import ErrorFallback from 'components/ErrorFallback';
import { WRAPPED_TOKEN_SYMBOL, WRAPPED_TOKEN } from 'config/relay-chains';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  INTERLAY_DENIM,
  INTERLAY_MULBERRY,
  KINTSUGI_MIDNIGHT,
  KINTSUGI_PRAIRIE_SAND
} from 'utils/constants/colors';
import { getLastMidnightTimestamps } from 'common/utils/utils';
import cumulativeVolumesFetcher,
{
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from 'services/fetchers/cumulative-volumes-till-timestamps-fetcher';

// get 6 values to be able to calculate difference between 5 days ago and 6 days ago
// thus issues per day 5 days ago can be displayed
// cumulative issues is also only displayed to 5 days
const cutoffTimestamps = getLastMidnightTimestamps(6, true);

const IssuedChart = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    isIdle: cumulativeIssuesPerDayIdle,
    isLoading: cumulativeIssuesPerDayLoading,
    data: cumulativeIssuesPerDay,
    error: cumulativeIssuesPerDayError
  // TODO: should type properly (`Relay`)
  } = useQuery<VolumeDataPoint<BitcoinUnit>[], Error>(
    [
      CUMULATIVE_VOLUMES_FETCHER,
      'Issued' as VolumeType,
      cutoffTimestamps,
      WRAPPED_TOKEN
    ],
    cumulativeVolumesFetcher
  );
  useErrorHandler(cumulativeIssuesPerDayError);

  const {
    isIdle: cumulativeRedeemsPerDayIdle,
    isLoading: cumulativeRedeemsPerDayLoading,
    data: cumulativeRedeemsPerDay,
    error: cumulativeRedeemsPerDayError
  // TODO: should type properly (`Relay`)
  } = useQuery<VolumeDataPoint<BitcoinUnit>[], Error>(
    [
      CUMULATIVE_VOLUMES_FETCHER,
      'Redeemed' as VolumeType,
      cutoffTimestamps,
      WRAPPED_TOKEN
    ],
    cumulativeVolumesFetcher
  );
  useErrorHandler(cumulativeRedeemsPerDayError);

  // TODO: should use skeleton loaders
  if (cumulativeIssuesPerDayIdle || cumulativeIssuesPerDayLoading ||
  cumulativeRedeemsPerDayIdle || cumulativeRedeemsPerDayLoading) {
    return <>Loading...</>;
  }
  if (cumulativeIssuesPerDay === undefined || cumulativeRedeemsPerDay === undefined) {
    throw new Error('Something went wrong!');
  }

  const cumulativeTvlPerDay = cumulativeIssuesPerDay.map((issuePoint, i) => {
    const redeemPoint = cumulativeRedeemsPerDay[i];
    return {
      amount: issuePoint.amount.sub(redeemPoint.amount),
      tillTimestamp: issuePoint.tillTimestamp
    };
  });

  const pointTvlPerDay = cumulativeTvlPerDay.map((dataPoint, i) => {
    if (i === 0) {
      return newMonetaryAmount(0, WRAPPED_TOKEN);
    } else {
      return dataPoint.amount.sub(cumulativeTvlPerDay[i - 1].amount);
    }
  }).slice(1); // cut off first 0 value

  let firstChartLineColor;
  let secondChartLineColor;
  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT) {
    firstChartLineColor = INTERLAY_DENIM[500];
    secondChartLineColor = INTERLAY_MULBERRY[500];
  // MEMO: should check dark mode as well
  } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    firstChartLineColor = KINTSUGI_MIDNIGHT[200];
    secondChartLineColor = KINTSUGI_PRAIRIE_SAND[400];
  } else {
    throw new Error('Something went wrong!');
  }

  return (
    <LineChart
      wrapperClassName='h-full'
      colors={[
        firstChartLineColor,
        secondChartLineColor
      ]}
      labels={[
        t('dashboard.issue.total_issued_chart', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        }),
        t('dashboard.issue.per_day_issued_chart', {
          wrappedTokenSymbol: WRAPPED_TOKEN_SYMBOL
        })
      ]}
      yLabels={
        cutoffTimestamps.slice(0, -1)
          .map(timestamp => timestamp.toISOString().substring(0, 10))
      }
      yAxes={[
        {
          position: 'left',
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 6
          }
        },
        {
          position: 'right',
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 6
          }
        }
      ]}
      datasets={[
        cumulativeTvlPerDay.slice(1).map(dataPoint => dataPoint.amount.str.BTC()),
        pointTvlPerDay.map(amount => amount.str.BTC())
      ]} />
  );
};

export default withErrorBoundary(IssuedChart, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
