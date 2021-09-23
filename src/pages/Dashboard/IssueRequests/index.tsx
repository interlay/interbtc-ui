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
import IssueRequestsTable from 'containers/IssueRequestsTable';
import LineChartComponent from '../components/line-chart-component';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { StoreType } from 'common/types/util.types';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';

function IssueRequests(): JSX.Element {
  const {
    totalWrappedTokenAmount,
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
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('issue_page.issue_requests')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayCalifornia',
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
              'text-interlayDenim',
              'font-bold',
              'text-xl'
            )}>
            {t('dashboard.issue.issued')}
          </h5>
          <h5>
            {t('dashboard.issue.total_interbtc', { amount: displayMonetaryAmount(totalWrappedTokenAmount) })}
          </h5>
          <h5 className='text-textSecondary'>
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
            {totalSuccessfulIssues === '-' ? t('no_data') : totalSuccessfulIssues}
          </h5>
        </div>
        <div
          className={clsx(
            'border',
            'rounded',
            'sm:flex-1'
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
                .map(dataPoint => Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())),
              pointIssuesPerDay.slice(1).map(sat => Number(BitcoinAmount.from.Satoshi(sat).str.BTC()))
            ]} />
        </div>
      </div>
      <IssueRequestsTable totalIssueRequests={totalIssueRequests} />
    </MainContainer>
  );
}

export default IssueRequests;
