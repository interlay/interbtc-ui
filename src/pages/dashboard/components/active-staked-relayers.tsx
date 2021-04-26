import { ReactElement, useState, useMemo, useEffect } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboard-colors';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import LineChartComponent from './line-chart-component';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

type ActiveStakedRelayers = {
  linkButton?: boolean;
};

// TODO: should rename `ActiveStakedRelayersComponent`
const ActiveStakedRelayersComponent = ({ linkButton }: ActiveStakedRelayers): ReactElement => {
  const statsApi = usePolkabtcStats();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [totalRelayersPerDay, setTotalRelayersPerDay] = useState(new Array<{ date: number; count: number }>());
  const fetchRelayersPerDay = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyRelayerCounts();
      setTotalRelayersPerDay(res.data);
    },
    [statsApi] // to silence the compiler
  );

  useEffect(() => {
    fetchRelayersPerDay();
  }, [fetchRelayersPerDay]);
  return (
    <DashboardCard>
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 style={{ color: getAccents('d_orange').color }}>{t('dashboard.parachain.active_relayers')}</h1>
          <h2>{totalRelayersPerDay[totalRelayersPerDay.length - 1]?.count}</h2>
        </div>

        {linkButton && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view relayers'
              propsButtonColor='d_orange'
              buttonId='active-staked'
              buttonLink={PAGES.parachain} />
          </div>
        )}
      </div>
      <LineChartComponent
        color='d_orange'
        label={t('dashboard.parachain.total_relayers_chart') as string}
        yLabels={totalRelayersPerDay.map(dataPoint =>
          new Date(dataPoint.date).toISOString().substring(0, 10)
        )}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={totalRelayersPerDay.map(dataPoint => dataPoint.count)} />
    </DashboardCard>
  );
};

export default ActiveStakedRelayersComponent;
