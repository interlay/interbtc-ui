
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';
import { BitcoinAmount } from '@interlay/monetary-js';

import LineChart from '../../LineChart';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import RedeemRequestsTable from 'containers/RedeemRequestsTable';
import ErrorFallback from 'components/ErrorFallback';
import Hr1 from 'components/hrs/Hr1';
import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
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

const RedeemRequests = (): JSX.Element => {
  const {
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
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

  const {
    isIdle: totalSuccessfulRedeemsIdle,
    isLoading: totalSuccessfulRedeemsLoading,
    data: totalSuccessfulRedeems,
    error: totalSuccessfulRedeemsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalSuccessfulRedeems'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalSuccessfulRedeemsError);

  const {
    isIdle: totalRedeemRequestsIdle,
    isLoading: totalRedeemRequestsLoading,
    data: totalRedeemRequests,
    error: totalRedeemRequestsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalRedeems'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalRedeemRequestsError);

  const {
    isIdle: totalRedeemedAmountIdle,
    isLoading: totalRedeemedAmountLoading,
    data: totalRedeemedAmount,
    error: totalRedeemedAmountError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      'interBtcIndex',
      'getTotalRedeemedAmount'
    ],
    genericFetcher<number>(),
    {
      enabled: !!bridgeLoaded
    }
  );
  useErrorHandler(totalRedeemedAmountError);

  const renderUpperContent = () => {
    // TODO: should use skeleton loaders
    if (cumulativeRedeemsPerDayIdle || cumulativeRedeemsPerDayLoading) {
      return <>Loading...</>;
    }
    if (totalSuccessfulRedeemsIdle || totalSuccessfulRedeemsLoading) {
      return <>Loading...</>;
    }
    if (totalRedeemedAmountIdle || totalRedeemedAmountLoading) {
      return <>Loading...</>;
    }
    if (cumulativeRedeemsPerDay === undefined) {
      throw new Error('Something went wrong!');
    }
    if (totalRedeemedAmount === undefined) {
      throw new Error('Something went wrong!');
    }

    const converted = cumulativeRedeemsPerDay.map(item => ({
      date: item.date.getTime(),
      sat: Number(item.btc.toString())
    }));

    const pointRedeemsPerDay = converted.map((dataPoint, i) => {
      if (i === 0) {
        return 0;
      } else {
        return dataPoint.sat - converted[i - 1].sat;
      }
    });

    // TODO: add this again when the network is stable
    // const redeemSuccessRate = totalSuccessfulRedeems / totalRedeemRequests;

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
              'text-interlayCalifornia',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.redeem.total_redeemed')}
          </h5>
          <h5
            className={clsx(
              'font-bold',
              'text-xl'
            )}>
            {BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC()}
            &nbsp;BTC
          </h5>
          <h5
            className={clsx(
              { 'text-interlayTextSecondaryInLightMode':
                process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production' },
              { 'dark:text-kintsugiTextSecondaryInDarkMode': process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA }
            )}>
            $
            {(prices.bitcoin.usd * Number(BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC())).toLocaleString()}
          </h5>
          <h5
            className={clsx(
              'text-interlayConifer',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.redeem.total_redeems')}
          </h5>
          <h5>
            {totalSuccessfulRedeems}
          </h5>
          {/* TODO: add this again when the network is stable */}
          {/* <h5
            className={clsx(
              'text-interlayConifer',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.redeem.success_rate')}
          </h5>
          <h5>
            {totalRedeemRequests ? (redeemSuccessRate * 100).toFixed(2) + '%' : t('no_data')}
          </h5> */}
        </div>
        <div
          className={clsx(
            'border',
            'rounded',
            'sm:flex-1'
          )}>
          <LineChart
            color={[
              'd_interlayCalifornia',
              'd_interlayPaleSky'
            ]}
            label={[
              t('dashboard.redeem.total_redeemed_chart'),
              t('dashboard.redeem.per_day_redeemed_chart')
            ]}
            yLabels={converted.map(dataPoint =>
              new Date(dataPoint.date).toLocaleDateString()
            )}
            yAxisProps={[{ beginAtZero: true, position: 'left' }, { position: 'right' }]}
            data={[
              converted.map(dataPoint =>
                Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())
              ),
              pointRedeemsPerDay.map(
                amount => Number(BitcoinAmount.from.Satoshi(amount).str.BTC())
              )
            ]} />
        </div>
      </div>
    );
  };

  const renderLowerContent = () => {
    // TODO: should use skeleton loaders
    if (totalRedeemRequestsIdle || totalRedeemRequestsLoading) {
      return <>Loading...</>;
    }
    if (totalRedeemRequests === undefined) {
      throw new Error('Something went wrong!');
    }

    return (
      <RedeemRequestsTable totalRedeemRequests={totalRedeemRequests} />
    );
  };

  return (
    <>
      <div>
        <PageTitle
          mainTitle={t('dashboard.redeem.redeem')}
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
};

export default withErrorBoundary(RedeemRequests, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
