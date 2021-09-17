import {
  useState,
  useEffect,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import RedeemRequestsTable from 'containers/RedeemRequestsTable';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { StoreType } from 'common/types/util.types';
import LineChartComponent from '../components/line-chart-component';

function RedeemRequests(): JSX.Element {
  const {
    bridgeLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = useInterbtcIndex();

  const [totalSuccessfulRedeems, setTotalSuccessfulRedeems] = useState('-');
  const [totalRedeemRequests, setTotalRedeemRequests] = useState(0);
  const [totalRedeemedAmount, setTotalRedeemedAmount] = useState('-');
  // eslint-disable-next-line no-array-constructor
  const [cumulativeRedeemsPerDay, setCumulativeRedeemsPerDay] = useState(new Array<{ date: number; sat: number }>());
  const pointRedeemsPerDay = useMemo(
    () =>
      cumulativeRedeemsPerDay.map((dataPoint, i) => {
        if (i === 0) return 0;
        return dataPoint.sat - cumulativeRedeemsPerDay[i - 1].sat;
      }),
    [cumulativeRedeemsPerDay]
  );
  /**
   * TODO: should not use `useMemo` as it's not the case like expensive array calculation.
   * - should double-check `useMemo` and `useCallback` cases
   */
  // const redeemSuccessRate = useMemo(() => Number(totalSuccessfulRedeems) / totalRedeemRequests || 0, [
  //   totalSuccessfulRedeems,
  //   totalRedeemRequests
  // ]);

  useEffect(() => {
    const fetchTotalSuccessfulRedeems = async () => {
      const res = await statsApi.getTotalSuccessfulRedeems();
      if (res) setTotalSuccessfulRedeems(res.toString());
    };

    const fetchTotalFailedRedeems = async () => {
      const res = await statsApi.getTotalRedeems();
      setTotalRedeemRequests(res);
    };

    const fetchTotalRedeemedAmount = async () => {
      const res = await statsApi.getTotalRedeemedAmount();
      if (res) setTotalRedeemedAmount(res.toString());
    };

    const fetchRedeemsLastDays = async () => {
      const res = await statsApi.getRecentDailyRedeems({ daysBack: 6 });
      setCumulativeRedeemsPerDay(res);
    };

    (async () => {
      if (!bridgeLoaded) return;
      try {
        await Promise.all([
          fetchTotalSuccessfulRedeems(),
          fetchTotalFailedRedeems(),
          fetchTotalRedeemedAmount(),
          fetchRedeemsLastDays()
        ]);
      } catch (error) {
        console.error('[RedeemRequests useEffect] error.message => ', error.message);
      }
    })();
  }, [
    bridgeLoaded,
    statsApi
  ]);

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.redeem.redeem')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayDenim',
            'mt-2'
          )} />
      </div>
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
            {totalRedeemedAmount === '-' ?
              t('no_data') :
              BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC()}
            &nbsp;BTC
          </h5>
          {totalRedeemedAmount !== '-' && (
            <h5 className='text-textSecondary'>
              $
              {/* eslint-disable-next-line max-len */}
              {(prices.bitcoin.usd * Number(BitcoinAmount.from.Satoshi(totalRedeemedAmount).str.BTC())).toLocaleString()}
            </h5>
          )}
          <h5
            className={clsx(
              'text-interlayConifer',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.redeem.total_redeems')}
          </h5>
          <h5>
            {totalSuccessfulRedeems === '-' ? t('no_data') : totalSuccessfulRedeems}
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
          <LineChartComponent
            color={['d_interlayCalifornia', 'd_interlayPaleSky']}
            label={[
              t('dashboard.redeem.total_redeemed_chart'),
              t('dashboard.redeem.per_day_redeemed_chart')
            ]}
            yLabels={cumulativeRedeemsPerDay.map(dataPoint =>
              new Date(dataPoint.date).toLocaleDateString()
            )}
            yAxisProps={[{ beginAtZero: true, position: 'left' }, { position: 'right' }]}
            data={[
              cumulativeRedeemsPerDay.map(dataPoint =>
                Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())
              ),
              pointRedeemsPerDay.map(
                amount => Number(BitcoinAmount.from.Satoshi(amount).str.BTC())
              )
            ]} />
        </div>
      </div>
      <RedeemRequestsTable totalRedeemRequests={totalRedeemRequests} />
    </MainContainer>
  );
}

export default RedeemRequests;
