
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
import useInterbtcStats from 'common/hooks/use-interbtc-stats';
import { StoreType } from 'common/types/util.types';

function IssueRequests(): JSX.Element {
  const {
    totalInterBTC,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = useInterbtcStats();

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
        setTotalSuccessfulIssues(res.data);
      },
      async () => {
        const res = await statsApi.getTotalIssues();
        setTotalIssueRequests(Number(res.data));
      }
    ],
    [statsApi] // To silence the compiler
  );

  const fetchIssuesLastDays = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyIssues(6);
      setCumulativeIssuesPerDay(res.data);
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
          <hr className='border-interlayTreePoppy' />
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
                'text-interlayRose',
                'font-bold',
                'text-xl'
              )}>
              {t('dashboard.issue.issued')}
            </h5>
            <h5>
              {t('dashboard.issue.total_interbtc', { amount: totalInterBTC })}
            </h5>
            <h5 className='text-textSecondary'>
              ${(prices.bitcoin.usd * parseFloat(totalInterBTC)).toLocaleString()}
            </h5>
            <h5
              className={clsx(
                'text-interlayMalachite',
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
                'd_pink',
                'd_grey'
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
                  .map(dataPoint => Number(satToBTC(dataPoint.sat.toString()))),
                pointIssuesPerDay.slice(1).map(sat => Number(satToBTC(sat.toString())))
              ]} />
          </div>
        </div>
        <IssueRequestsTable totalIssueRequests={totalIssueRequests} />
      </div>
    </MainContainer>
  );
}

export default IssueRequests;
