import { useState, useEffect, ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAccents } from '../../../pages/dashboard/dashboard-colors';
import { StoreType } from '../../../common/types/util.types';
import { DashboardRequestInfo } from '../../../common/types/redeem.types';
import DashboardTable, {
  StyledLinkData,
  StatusComponent,
  StatusCategories
} from '../../../common/components/dashboard-table/dashboard-table';
import * as constants from '../../../constants';
import { defaultTableDisplayParams, shortAddress, formatDateTimePrecise } from '../../../common/utils/utils';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import { satToBTC } from '@interlay/polkabtc';
import LineChartComponent from '../components/line-chart-component';
import { BtcNetworkName, RedeemColumns } from '@interlay/polkabtc-stats';
import TimerIncrement from '../../../common/components/timer-increment';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

export default function RedeemDashboard(): ReactElement {
  const { polkaBtcLoaded, prices } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();

  const [tableParams, setTableParams] = useState(defaultTableDisplayParams<RedeemColumns>());
  const [totalSuccessfulRedeems, setTotalSuccessfulRedeems] = useState('-');
  const [totalRedeems, setTotalRedeems] = useState('-');
  const [totalRedeemedAmount, setTotalRedeemedAmount] = useState('-');
  // eslint-disable-next-line no-array-constructor
  const [redeemRequests, setRedeemRequests] = useState(new Array<DashboardRequestInfo>());
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
  const redeemSuccessRate = useMemo(() => Number(totalSuccessfulRedeems) / Number(totalRedeems) || 0, [
    totalSuccessfulRedeems,
    totalRedeems
  ]);

  const tableHeadings: ReactElement[] = [
    // <h1>{t("id")}</h1>,
    <h1>{t('date')}</h1>,
    <h1>{t('redeem_page.amount')}</h1>,
    <h1>{t('parachainblock')}</h1>,
    <h1>{t('issue_page.vault_dot_address')}</h1>,
    <h1>{t('redeem_page.output_BTC_address')}</h1>,
    // "BTC Transaction",
    // "BTC Confirmations",
    <h1>{t('status')}</h1>
  ];

  const tableRedeemRequestRow = useMemo(
    () => (rreq: DashboardRequestInfo): ReactElement[] => [
      // <p>{shortAddress(ireq.id)}</p>,
      <p>{formatDateTimePrecise(new Date(rreq.timestamp))}</p>,
      <p>{rreq.amountPolkaBTC}</p>,
      <p>{rreq.creation}</p>,
      <p>{shortAddress(rreq.vaultDotAddress)}</p>,
      <StyledLinkData
        data={shortAddress(rreq.btcAddress)}
        target={
          (constants.BTC_MAINNET ?
            constants.BTC_EXPLORER_ADDRESS_API :
            constants.BTC_TEST_EXPLORER_ADDRESS_API) + rreq.btcAddress
        }
        newTab={true} />,
      <StatusComponent
        {...(rreq.completed ?
          { text: t('completed'), category: StatusCategories.Ok } :
          rreq.cancelled ?
            { text: t('cancelled'), category: StatusCategories.Bad } :
            rreq.isExpired ?
              { text: t('expired'), category: StatusCategories.Bad } :
              rreq.reimbursed ?
                { text: t('reimbursed'), category: StatusCategories.Ok } :
                { text: t('pending'), category: StatusCategories.Warning })} />
    ],
    [t]
  );

  const fetchRedeemRequests = useMemo(
    () => async () => {
      const res = await statsApi.getRedeems(
        tableParams.page,
        tableParams.perPage,
        tableParams.sortBy,
        tableParams.sortAsc,
        constants.BITCOIN_NETWORK as BtcNetworkName
      );
      setRedeemRequests(res.data);
    },
    [tableParams, statsApi]
  );

  useEffect(() => {
    try {
      fetchRedeemRequests();
    } catch (e) {
      console.error(e);
    }
  }, [fetchRedeemRequests, tableParams]);

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
      } catch (e) {
        console.error(e);
      }
    })();
  }, [polkaBtcLoaded, statsApi]);

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <PageTitle
              mainTitle={t('dashboard.redeem.redeem')}
              subTitle={<TimerIncrement />} />
            <div
              style={{ backgroundColor: getAccents('d_pink').color }}
              className='title-line' />
            <div className='table-top-data-container'>
              <div className='values-container redeem-page'>
                <div>
                  <h2 style={{ color: `${getAccents('d_yellow').color}` }}>
                    {t('dashboard.redeem.total_redeemed')}
                  </h2>
                  <h1>
                    {totalRedeemedAmount === '-' ? t('no_data') : satToBTC(totalRedeemedAmount)}
                                        &nbsp;BTC
                  </h1>
                  {totalRedeemedAmount === '-' ? (
                    ''
                  ) : (
                    <h1 className='h1-price-opacity'>
                      $
                      {(
                        prices.bitcoin.usd * parseFloat(satToBTC(totalRedeemedAmount))
                      ).toLocaleString()}
                    </h1>
                  )}
                </div>
                <div>
                  <h2 style={{ color: getAccents('d_green').color }}>
                    {t('dashboard.redeem.total_redeems')}
                  </h2>
                  <h1>{totalSuccessfulRedeems === '-' ? t('no_data') : totalSuccessfulRedeems}</h1>
                </div>
                <div>
                  <h2 style={{ color: getAccents('d_green').color }}>
                    {t('dashboard.redeem.success_rate')}
                  </h2>
                  <h1>
                    {totalRedeems === '-' ?
                      t('no_data') :
                      (redeemSuccessRate * 100).toFixed(2) + '%'}
                  </h1>
                </div>
              </div>
              <div className='card'>
                <div className='chart-container'>
                  <LineChartComponent
                    color={['d_yellow', 'd_grey']}
                    label={[
                      t('dashboard.redeem.total_redeemed_chart'),
                      t('dashboard.redeem.perday_redeemed_chart')
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
            </div>
            <div style={{ margin: '40px 0px' }}>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: '26px'
                  }}>
                  {t('issue_page.recent_requests')}
                </p>
              </div>
              <DashboardTable
                richTable={true}
                pageData={redeemRequests}
                totalPages={Math.ceil(Number(totalRedeems) / tableParams.perPage)}
                tableParams={tableParams}
                setTableParams={setTableParams}
                headings={tableHeadings}
                dataPointDisplayer={tableRedeemRequestRow} />
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
