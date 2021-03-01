import React, { useState, useEffect, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import { satToBTC } from '@interlay/polkabtc';
import { getAccents } from '../../../pages/dashboard/dashboard-colors';
import { StoreType } from '../../../common/types/util.types';
import { DashboardIssueInfo } from '../../../common/types/issue.types';
import { defaultTableDisplayParams, shortAddress, formatDateTimePrecise } from '../../../common/utils/utils';
import DashboardTable, {
  StyledLinkData,
  StatusComponent,
  StatusCategories
} from '../../../common/components/dashboard-table/dashboard-table';
import * as constants from '../../../constants';
import '../dashboard-subpage.scss';
import { BtcNetworkName, IssueColumns } from '@interlay/polkabtc-stats';
import TimerIncrement from '../../../common/components/timer-increment';
import LineChartComponent from '../components/line-chart-component';
import TestnetBanner from '../../../common/components/testnet-banner';

export default function IssueDashboard(): ReactElement {
  const { totalPolkaBTC, prices } = useSelector((state: StoreType) => state.general);
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
    () =>
      cumulativeIssuesPerDay.map((dataPoint, i) => {
        if (i === 0) return 0;
        return dataPoint.sat - cumulativeIssuesPerDay[i - 1].sat;
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
    [tableParams, statsApi]
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
    [statsApi] // to silence the compiler
  );

  const tableHeadings = [
    // <h1>{t("id")}</h1>,
    <h1>{t('date')}</h1>,
    <h1>{t('issue_page.amount')}</h1>,
    <h1>{t('issue_page.parachain_block')}</h1>,
    <h1>{t('issue_page.vault_dot_address')}</h1>,
    <h1>{t('issue_page.vault_btc_address')}</h1>,
    // "BTC Transaction",
    // "BTC Confirmations",
    <h1>{t('status')}</h1>
  ];

  const tableIssueRequestRow = useMemo(
    () => (ireq: DashboardIssueInfo): ReactElement[] => [
      // <p>{shortAddress(ireq.id)}</p>,
      <p>{formatDateTimePrecise(new Date(ireq.timestamp))}</p>,
      <p>{ireq.amountBTC}</p>,
      <p>{ireq.creation}</p>,
      <p>{shortAddress(ireq.vaultDOTAddress)}</p>,
      <StyledLinkData
        data={shortAddress(ireq.vaultBTCAddress)}
        target={
          (constants.BTC_MAINNET ?
            constants.BTC_EXPLORER_ADDRESS_API :
            constants.BTC_TEST_EXPLORER_ADDRESS_API) + ireq.vaultBTCAddress
        }
        newTab={true} />,
      <StatusComponent
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
    [statsApi] // to silence the compiler
  );

  useEffect(() => {
    try {
      fetchIssueRequests();
      fetchIssuesLastDays();
    } catch (e) {
      console.error(e);
    }
  }, [fetchIssueRequests, tableParams, fetchIssuesLastDays]);

  useEffect(() => {
    try {
      fetchTotalSuccessfulIssues();
      fetchTotalIssues();
    } catch (e) {
      console.error(e);
    }
  }, [fetchTotalSuccessfulIssues, fetchTotalIssues]);

  return (
    <div className='main-container dashboard-page'>
      <TestnetBanner />
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <div className='title-container'>
              <h1 className='title-text'>{t('issue_page.issue_requests')}</h1>
              <p className='latest-block-text'>
                <TimerIncrement></TimerIncrement>
              </p>
              <div
                style={{ backgroundColor: getAccents('d_yellow').color }}
                className='title-line'>
              </div>
            </div>
            <div className='table-top-data-container'>
              <div className='values-container'>
                <div>
                  <h2 style={{ color: getAccents('d_yellow').color }}>
                    {t('dashboard.issue.issued')}
                  </h2>
                  <h1>{t('dashboard.issue.total_polkabtc', { amount: totalPolkaBTC })}</h1>
                  <h1 className='h1-price-opacity'>
                                        ${(prices.bitcoin.usd * parseFloat(totalPolkaBTC)).toLocaleString()}
                  </h1>
                </div>
                <div>
                  <h2 style={{ color: getAccents('d_green').color }}>
                    {t('dashboard.issue.issue_requests')}
                  </h2>
                  <h1>{totalSuccessfulIssues === '-' ? t('no_data') : totalSuccessfulIssues}</h1>
                </div>
              </div>
              <div className='card'>
                <div className='chart-container'>
                  <LineChartComponent
                    color={['d_yellow', 'd_grey']}
                    label={[
                      t('dashboard.issue.total_issued_chart'),
                      t('dashboard.issue.perday_issued_chart')
                    ]}
                    yLabels={cumulativeIssuesPerDay
                      .slice(1)
                      .map(dataPoint =>
                        new Date(dataPoint.date).toISOString().substring(0, 10)
                      )}
                    yAxisProps={[
                      { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
                      { position: 'right', maxTicksLimit: 6 }
                    ]}
                    data={[
                      cumulativeIssuesPerDay
                        .slice(1)
                        .map(dataPoint => Number(satToBTC(dataPoint.sat.toString()))),
                      pointIssuesPerDay.slice(1).map(sat => Number(satToBTC(sat.toString())))
                    ]} />
                </div>
              </div>
            </div>
            <div className='dashboard-table-container'>
              <div>
                <p className='table-heading'>{t('issue_page.recent_requests')}</p>
              </div>
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
        </div>
      </div>
    </div>
  );
}
