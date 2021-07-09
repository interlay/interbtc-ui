import {
  useState,
  useEffect,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { satToBTC } from '@interlay/interbtc';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import IssueRequestsTable from 'containers/IssueRequestsTable';
import LineChartComponent from '../components/line-chart-component';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { StoreType } from 'common/types/util.types';
import BN from 'bn.js';

function IssueRequests(): JSX.Element {
  const {
    totalPolkaBTC,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = useInterbtcIndex();

  const [totalSuccessfulIssues, setTotalSuccessfulIssues] = useState('-');
  const [totalIssueRequests, setTotalIssueRequests] = useState(0);

  // eslint-disable-next-line no-array-constructor
  const [cumulativeIssuesPerDay, setCumulativeIssuesPerDay] = useState(new Array<{ date: number; sat: number }>());
  const pointIssuesPerDay = useMemo(
    () => cumulativeIssuesPerDay.map((dataPoint, index) => {
      if (index === 0) return 0;
      return dataPoint.sat - cumulativeIssuesPerDay[index - 1].sat;
    }),
    [cumulativeIssuesPerDay]
  );

  const [fetchTotalSuccessfulIssues, fetchTotalIssues] = useMemo(
    () => [
      async () => {
        const res = await statsApi.getTotalSuccessfulIssues();
        if (res) setTotalSuccessfulIssues(res.toString());
      },
      async () => {
        const res = await statsApi.getTotalIssues();
        setTotalIssueRequests(res);
      }
    ],
    [statsApi] // To silence the compiler
  );

  const fetchIssuesLastDays = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyIssues({ daysBack: 6 });
      setCumulativeIssuesPerDay(res);
    },
    [statsApi] // To silence the compiler
  );

  useEffect(() => {
    try {
      fetchIssuesLastDays();
    } catch (error) {
      console.error('[IssueRequests useEffect] error.message => ', error.message);
    }
  }, [
    fetchIssuesLastDays
  ]);

  useEffect(() => {
    try {
      fetchTotalSuccessfulIssues();
      fetchTotalIssues();
    } catch (error) {
      console.error('[IssueRequests useEffect] error.message => ', error.message);
    }
  }, [
    fetchTotalSuccessfulIssues,
    fetchTotalIssues
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
        <div>
          <PageTitle
            mainTitle={t('issue_page.issue_requests')}
            subTitle={<TimerIncrement />} />
          <hr className='border-interlayCalifornia' />
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
              'sm:flex-1',
              'mx-6'
            )}>
            <h5
              className={clsx(
                'text-interlayDenim',
                'font-bold',
                'text-xl'
              )}>
              {t('dashboard.issue.issued')}
            </h5>
            <h5>
              {t('dashboard.issue.total_interbtc', { amount: totalPolkaBTC })}
            </h5>
            <h5 className='text-textSecondary'>
              ${(prices.bitcoin.usd * parseFloat(totalPolkaBTC)).toLocaleString()}
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
              {totalSuccessfulIssues === '-' ? t('no_data') : totalSuccessfulIssues}
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
              color={[
                'd_interlayDenim',
                'd_interlayPaleSky'
              ]}
              label={[
                t('dashboard.issue.total_issued_chart'),
                t('dashboard.issue.per_day_issued_chart')
              ]}
              yLabels={
                cumulativeIssuesPerDay
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
                cumulativeIssuesPerDay
                  .slice(1)
                  .map(dataPoint => Number(satToBTC(new BN(dataPoint.sat)))),
                pointIssuesPerDay.slice(1).map(sat => Number(new BN(sat)))
              ]} />
          </div>
        </div>
        <IssueRequestsTable totalIssueRequests={totalIssueRequests} />
      </div>
    </MainContainer>
  );
}

export default IssueRequests;
