import { newMonetaryAmount } from '@interlay/interbtc-api';
import { BitcoinUnit } from '@interlay/monetary-js';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getLastMidnightTimestamps } from '@/common/utils/utils';
import ErrorFallback from '@/components/ErrorFallback';
import { COUNT_OF_DATES_FOR_CHART } from '@/config/charts';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import LineChart from '@/pages/Dashboard/LineChart';
import cumulativeVolumesFetcher, {
  CUMULATIVE_VOLUMES_FETCHER,
  VolumeDataPoint,
  VolumeType
} from '@/services/fetchers/cumulative-volumes-fetcher';
import { INTERLAY_DENIM, INTERLAY_MULBERRY, KINTSUGI_MIDNIGHT, KINTSUGI_PRAIRIE_SAND } from '@/utils/constants/colors';
import { KUSAMA, POLKADOT } from '@/utils/constants/relay-chain-names';

const cutoffTimestamps = getLastMidnightTimestamps(COUNT_OF_DATES_FOR_CHART, true);

const RedeemedChart = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    isIdle: cumulativeRedeemsPerDayIdle,
    isLoading: cumulativeRedeemsPerDayLoading,
    data: cumulativeRedeemsPerDay,
    error: cumulativeRedeemsPerDayError
    // TODO: should type properly (`Relay`)
  } = useQuery<VolumeDataPoint<BitcoinUnit>[], Error>(
    [CUMULATIVE_VOLUMES_FETCHER, VolumeType.Redeemed, cutoffTimestamps, WRAPPED_TOKEN],
    cumulativeVolumesFetcher
  );
  useErrorHandler(cumulativeRedeemsPerDayError);

  if (cumulativeRedeemsPerDayIdle || cumulativeRedeemsPerDayLoading) {
    return <>Loading...</>;
  }
  if (cumulativeRedeemsPerDay === undefined) {
    throw new Error('Something went wrong!');
  }

  const pointRedeemsPerDay = cumulativeRedeemsPerDay
    .map((dataPoint, i) => {
      if (i === 0) {
        return newMonetaryAmount(0, WRAPPED_TOKEN);
      } else {
        return dataPoint.amount.sub(cumulativeRedeemsPerDay[i - 1].amount);
      }
    })
    .slice(1); // cut off first 0 value

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
      colors={[firstChartLineColor, secondChartLineColor]}
      labels={[t('dashboard.redeem.total_redeemed_chart'), t('dashboard.redeem.per_day_redeemed_chart')]}
      yLabels={cutoffTimestamps.slice(0, -1).map((timestamp) => timestamp.toLocaleDateString())}
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
        cumulativeRedeemsPerDay.slice(1).map((dataPoint) => dataPoint.amount.str.BTC()),
        pointRedeemsPerDay.map((amount) => amount.str.BTC())
      ]}
    />
  );
};

export default withErrorBoundary(RedeemedChart, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
