
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { BitcoinAmount } from '@interlay/monetary-js';

import LineChart from '../LineChart';
import ErrorFallback from 'components/ErrorFallback';
import { WRAPPED_TOKEN_SYMBOL } from 'config/relay-chains';
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

const IssuedChart = (): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
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

  let firstChartLineColor;
  let secondChartLineColor;
  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production') {
    firstChartLineColor = INTERLAY_DENIM[500];
    secondChartLineColor = INTERLAY_MULBERRY[500];
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
        converted
          .slice(1)
          .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))
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
            maxTicksLimit: 6
          }
        }
      ]}
      datasets={[
        converted
          .slice(1)
          .map(dataPoint => Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())),
        pointIssuesPerDay.slice(1).map(sat => Number(BitcoinAmount.from.Satoshi(sat).str.BTC()))
      ]} />
  );
};

export default withErrorBoundary(IssuedChart, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
