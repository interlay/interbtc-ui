
import {
  useState,
  useEffect,
  ReactElement,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { satToBTC } from '@interlay/polkabtc';
import {
  BtcNetworkName,
  IssueColumns
} from '@interlay/polkabtc-stats';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import DashboardTable, {
  StyledLinkData,
  StatusComponent,
  StatusCategories
} from 'common/components/dashboard-table/dashboard-table';
import LineChartComponent from '../components/line-chart-component';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
import { DashboardIssueInfo } from 'common/types/issue.types';
import {
  defaultTableDisplayParams,
  shortAddress,
  formatDateTimePrecise
} from 'common/utils/utils';
import * as constants from '../../../constants';

function IssueDashboard(): JSX.Element {
  const {
    totalPolkaBTC,
    prices
  } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();
  // eslint-disable-next-line no-array-constructor
  const [issueRequests, setIssueRequests] = useState(new Array<DashboardIssueInfo>());
  const [tableParams, setTableParams] = useState(defaultTableDisplayParams<IssueColumns>());

  const [totalSuccessfulIssues, setTotalSuccessfulIssues] = useState('-');
  const [totalIssues, setTotalIssues] = useState('-');

  // eslint-disable-next-line no-array-constructor
  const [cumulativeIssuesPerDay, setCumulativeIssuesPerDay] = useState(new Array<{ date: number; sat: number }>());
  const pointIssuesPerDay = useMemo(
    () => cumulativeIssuesPerDay.map((dataPoint, index) => {
      if (index === 0) return 0;
      return dataPoint.sat - cumulativeIssuesPerDay[index - 1].sat;
    }),
    [cumulativeIssuesPerDay]
  );

  const fetchIssueRequests = useMemo(
    () => async () => {
      const res = await statsApi.getIssues(
        tableParams.page,
        tableParams.perPage,
        tableParams.sortBy,
        tableParams.sortAsc,
        constants.BITCOIN_NETWORK as BtcNetworkName // not sure why cast is necessary here, but TS complains
      );
      setIssueRequests(res.data);
    },
    [
      tableParams,
      statsApi
    ]
  );

  const [fetchTotalSuccessfulIssues, fetchTotalIssues] = useMemo(
    () => [
      async () => {
        const res = await statsApi.getTotalSuccessfulIssues();
        setTotalSuccessfulIssues(res.data);
      },
      async () => {
        const res = await statsApi.getTotalIssues();
        setTotalIssues(res.data);
      }
    ],
    [statsApi] // To silence the compiler
  );

  const tableHeadings = [
    <h1 key={1}>{t('date')}</h1>,
    <h1 key={2}>{t('issue_page.amount')}</h1>,
    <h1 key={3}>{t('issue_page.parachain_block')}</h1>,
    <h1 key={4}>{t('issue_page.vault_dot_address')}</h1>,
    <h1 key={5}>{t('issue_page.vault_btc_address')}</h1>,
    <h1 key={6}>{t('status')}</h1>
  ];

  const tableIssueRequestRow = useMemo(
    () => (ireq: DashboardIssueInfo): ReactElement[] => [
      <p key={1}>{formatDateTimePrecise(new Date(ireq.timestamp))}</p>,
      <p key={2}>{ireq.amountBTC}</p>,
      <p key={3}>{ireq.creation}</p>,
      <p key={4}>{shortAddress(ireq.vaultDOTAddress)}</p>,
      <StyledLinkData
        key={5}
        data={shortAddress(ireq.vaultBTCAddress)}
        target={
          (constants.BTC_MAINNET ?
            constants.BTC_EXPLORER_ADDRESS_API :
            constants.BTC_TEST_EXPLORER_ADDRESS_API) + ireq.vaultBTCAddress
        }
        newTab={true} />,
      <StatusComponent
        key={6}
        {...(ireq.completed ?
          { text: t('completed'), category: StatusCategories.Ok } :
          ireq.cancelled ?
            { text: t('cancelled'), category: StatusCategories.Bad } :
            { text: t('pending'), category: StatusCategories.Warning })} />
    ],
    [t]
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
      fetchIssueRequests();
      fetchIssuesLastDays();
    } catch (error) {
      console.error('[IssueDashboard useEffect] error.message => ', error.message);
    }
  }, [
    fetchIssueRequests,
    tableParams,
    fetchIssuesLastDays
  ]);

  useEffect(() => {
    try {
      fetchTotalSuccessfulIssues();
      fetchTotalIssues();
    } catch (error) {
      console.error('[IssueDashboard useEffect] error.message => ', error.message);
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
              {t('dashboard.issue.total_polkabtc', { amount: totalPolkaBTC })}
            </h5>
            <h5 className='text-textSecondary'>
              ${(prices.bitcoin.usd * parseFloat(totalPolkaBTC)).toLocaleString()}
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
        <div>
          <h2
            className={clsx(
              'text-2xl',
              'font-bold'
            )}>
            {t('issue_page.recent_requests')}
          </h2>
          <DashboardTable
            richTable={true}
            pageData={issueRequests}
            totalPages={Math.ceil(Number(totalIssues) / tableParams.perPage)}
            tableParams={tableParams}
            setTableParams={setTableParams}
            headings={tableHeadings}
            dataPointDisplayer={tableIssueRequestRow} />
        </div>
      </div>
    </MainContainer>
  );
}

export default IssueDashboard;
