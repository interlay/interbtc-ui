
import {
  useState,
  useEffect,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { satToBTC } from '@interlay/polkabtc';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import RedeemRequestsTable from 'containers/RedeemRequestsTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
import LineChartComponent from '../components/line-chart-component';

function RedeemDashboard(): JSX.Element {
  const {
    polkaBtcLoaded,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();

  const [totalSuccessfulRedeems, setTotalSuccessfulRedeems] = useState('-');
  const [totalRedeems, setTotalRedeems] = useState('-');
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
  const redeemSuccessRate = useMemo(() => Number(totalSuccessfulRedeems) / Number(totalRedeems) || 0, [
    totalSuccessfulRedeems,
    totalRedeems
  ]);

  useEffect(() => {
    const fetchTotalSuccessfulRedeems = async () => {
      const res = await statsApi.getTotalSuccessfulRedeems();
      setTotalSuccessfulRedeems(res.data);
    };

    const fetchTotalFailedRedeems = async () => {
      const res = await statsApi.getTotalRedeems();
      setTotalRedeems(res.data);
    };

    const fetchTotalRedeemedAmount = async () => {
      const res = await statsApi.getTotalRedeemedAmount();
      setTotalRedeemedAmount(res.data);
    };

    const fetchRedeemsLastDays = async () => {
      const res = await statsApi.getRecentDailyRedeems(6);
      setCumulativeRedeemsPerDay(res.data);
    };

    (async () => {
      if (!polkaBtcLoaded) return;
      try {
        await Promise.all([
          fetchTotalSuccessfulRedeems(),
          fetchTotalFailedRedeems(),
          fetchTotalRedeemedAmount(),
          fetchRedeemsLastDays()
        ]);
      } catch (error) {
        console.error('[RedeemDashboard useEffect] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    statsApi
  ]);

  return (
    <MainContainer
      className={clsx(
        'flex',
        'justify-center',
        'fade-in-animation'
      )}>
      <div
        className={clsx(
          'w-3/4',
          'space-y-10'
        )}>
        <PageTitle
          mainTitle={t('dashboard.redeem.redeem')}
          subTitle={<TimerIncrement />} />
        <hr className='border-interlayRose' />
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
              'sm:flex-1',
              'mx-6'
            )}>
            <h5
              className={clsx(
                'text-interlayTreePoppy',
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
              {totalRedeemedAmount === '-' ? t('no_data') : satToBTC(totalRedeemedAmount)}
              &nbsp;BTC
            </h5>
            {totalRedeemedAmount !== '-' && (
              <h5 className='text-textSecondary'>
                $
                {(prices.bitcoin.usd * parseFloat(satToBTC(totalRedeemedAmount))).toLocaleString()}
              </h5>
            )}
            <h5
              className={clsx(
                'text-interlayMalachite',
                'font-bold',
                'text-xl'
              )}>
              {t('dashboard.redeem.total_redeems')}
            </h5>
            <h5>
              {totalSuccessfulRedeems === '-' ? t('no_data') : totalSuccessfulRedeems}
            </h5>
            <h5
              className={clsx(
                'text-interlayMalachite',
                'font-bold',
                'text-xl'
              )}>
              {t('dashboard.redeem.success_rate')}
            </h5>
            <h5>
              {totalRedeems === '-' ? t('no_data') : (redeemSuccessRate * 100).toFixed(2) + '%'}
            </h5>
          </div>
          <div
            className={clsx(
              'border',
              'rounded',
              'sm:flex-1',
              'mx-6'
            )}>
            <LineChartComponent
              color={['d_yellow', 'd_grey']}
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
                  Number(satToBTC(dataPoint.sat.toString()))
                ),
                pointRedeemsPerDay.map(amount => Number(satToBTC(amount.toString())))
              ]} />
          </div>
        </div>
        <RedeemRequestsTable />
      </div>
    </MainContainer>
  );
}

export default RedeemDashboard;
