import { ReactElement, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import ParachainSecurity from '../components/parachain-security';
import { DashboardStatusUpdateInfo } from '../../../common/types/util.types';
import useInterbtcIndex from '../../../common/hooks/use-interbtc-index';
import { defaultTableDisplayParams, formatDateTimePrecise } from '../../../common/utils/utils';
import DashboardTable, {
  StatusComponent,
  StatusCategories
} from '../../../common/components/dashboard-table/dashboard-table';
import { StatusUpdateColumns } from '@interlay/interbtc-index-client';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function ParachainDashboard(): ReactElement {
  const { t } = useTranslation();
  const statsApi = useInterbtcIndex();
  // eslint-disable-next-line no-array-constructor
  const [statusUpdates, setStatusUpdates] = useState(new Array<DashboardStatusUpdateInfo>());
  const [tableParams, setTableParams] = useState({
    ...defaultTableDisplayParams<StatusUpdateColumns>(),
    perPage: 10
  });
  const [totalStatusUpdates, setTotalStatusUpdates] = useState('-');

  const fetchStatusUpdates = useMemo(
    () => async () => {
      const res = await statsApi.getParachainStatusUpdates(tableParams);
      setStatusUpdates(res);
    },
    [tableParams, statsApi]
  );

  const fetchTotalStatusUpdates = useMemo(
    () => async () => {
      const res = await statsApi.getTotalParachainStatusUpdates();
      setTotalStatusUpdates(res.toString());
    },
    [statsApi] // to silence the compiler
  );

  useEffect(() => {
    try {
      fetchStatusUpdates();
    } catch (e) {
      console.error(e);
    }
  }, [fetchStatusUpdates, tableParams]);

  useEffect(() => {
    try {
      fetchTotalStatusUpdates();
    } catch (e) {
      console.error(e);
    }
  }, [fetchTotalStatusUpdates]);

  const tableHeadings = [
    <h1 key={1}>{t('id')}</h1>,
    <h1 key={2}>{t('timestamp')}</h1>,
    <h1 key={3}>{t('proposed_status')}</h1>,
    <h1 key={4}>{t('proposed_changes')}</h1>,
    <h1 key={5}>{t('btc_block_hash')}</h1>,
    <h1 key={6}>{t('votes_yes_no')}</h1>,
    <h1 key={7}>{t('result')}</h1>
  ];

  const tableStatusUpdateRow = useMemo(
    () => (updt: DashboardStatusUpdateInfo): ReactElement[] => [
      <p key={1}>{updt.id}</p>,
      <p key={2}>{formatDateTimePrecise(new Date(Number(updt.timestamp)))}</p>,
      <p key={3}>
        {updt.addError ?
          [t('dashboard.parachain.add_error', { error: updt.addError }), updt.removeError ? <br /> : ''] :
          updt.removeError ?
            t('dashboard.parachain.remove_error', { error: updt.removeError }) :
            t('dashboard.parachain.no_change')}
      </p>,
      <p key={4}>{updt.btcBlockHash}</p>,
      <p key={5}>{t('dashboard.parachain.votes', { yeas: updt.yeas, nays: updt.nays })}</p>,
      <StatusComponent
        key={6}
        {...(updt.executed ?
          { text: t('dashboard.parachain.executed'), category: StatusCategories.Ok } :
          updt.forced ?
            { text: t('dashboard.parachain.forced'), category: StatusCategories.Ok } :
            updt.rejected ?
              { text: t('dashboard.parachain.rejected'), category: StatusCategories.Bad } :
              { text: t('pending'), category: StatusCategories.Neutral })} />
    ],
    [t]
  );

  return (
    <MainContainer
      className={clsx(
        'flex',
        'justify-center',
        'fade-in-animation'
      )}>
      <div className='w-3/4'>
        <div>
          <PageTitle
            mainTitle={t('dashboard.parachain.parachain')}
            subTitle={<TimerIncrement />} />
          <hr className='border-interlayDenim' />
          <div className='grid grid-cols-2 gap-7 mt-10'>
            <ParachainSecurity />
          </div>
          <div style={{ margin: '40px 0px' }}>
            <div>
              <p
                className='mb-4'
                style={{
                  fontWeight: 700,
                  fontSize: '26px'
                }}>
                {t('dashboard.parachain.status_updates')}
              </p>
            </div>
            <DashboardTable
              richTable={true}
              pageData={statusUpdates}
              totalPages={Math.ceil(Number(totalStatusUpdates) / tableParams.perPage)}
              tableParams={tableParams}
              setTableParams={setTableParams}
              headings={tableHeadings}
              dataPointDisplayer={tableStatusUpdateRow} />
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
