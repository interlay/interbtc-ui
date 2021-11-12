
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { BitcoinAmount } from '@interlay/monetary-js';

import LineChart from '../../../../LineChart';
import ErrorFallback from 'components/ErrorFallback';
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

const RedeemedChart = (): JSX.Element => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const {
    isIdle: cumulativeRedeemsPerDayIdle,
    isLoading: cumulativeRedeemsPerDayLoading,
    data: cumulativeRedeemsPerDay,
    error: cumulativeRedeemsPerDayError
  } = useQuery<Array<BTCTimeData>, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getRecentDailyRedeems',
      { daysBack: 6 }
    ],
    genericFetcher<Array<BTCTimeData>>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(cumulativeRedeemsPerDayError);

  if (cumulativeRedeemsPerDayIdle || cumulativeRedeemsPerDayLoading) {
    return <>Loading...</>;
  }
  if (cumulativeRedeemsPerDay === undefined) {
    throw new Error('Something went wrong!');
  }

  const converted = cumulativeRedeemsPerDay.map(item => ({
    date: item.date.getTime(),
    sat: Number(item.btc.str.Satoshi())
  }));

  const pointRedeemsPerDay = converted.map((dataPoint, i) => {
    if (i === 0) {
      return 0;
    } else {
      return dataPoint.sat - converted[i - 1].sat;
    }
  });

  return (
    <LineChart
      colors={[
        'd_interlayCalifornia',
        'd_interlayPaleSky'
      ]}
      labels={[
        t('dashboard.redeem.total_redeemed_chart'),
        t('dashboard.redeem.per_day_redeemed_chart')
      ]}
      yLabels={
        converted
          .map(dataPoint => new Date(dataPoint.date).toLocaleDateString())
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
      datasets={[
        converted
          .map(dataPoint =>
            Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())
          ),
        pointRedeemsPerDay
          .map(
            amount => Number(BitcoinAmount.from.Satoshi(amount).str.BTC())
          )
      ]} />
  );
};

export default withErrorBoundary(RedeemedChart, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
