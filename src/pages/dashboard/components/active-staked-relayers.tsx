import { ReactElement, useState, useMemo, useEffect } from 'react';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayMulberryOutlinedButton from 'components/buttons/InterlayMulberryOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getAccents } from '../dashboard-colors';
import useInterbtcIndex from '../../../common/hooks/use-interbtc-index';
import LineChartComponent from './line-chart-component';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

type ActiveStakedRelayers = {
  linkButton?: boolean;
};

// TODO: should rename `ActiveStakedRelayersComponent`
const ActiveStakedRelayersComponent = ({ linkButton }: ActiveStakedRelayers): ReactElement => {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [totalRelayersPerDay, setTotalRelayersPerDay] = useState(new Array<{ date: number; count: number }>());
  const fetchRelayersPerDay = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyRelayerCounts({});
      setTotalRelayersPerDay(res);
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
          <h1 style={{ color: getAccents('d_interlayMulberry').color }}>{t('dashboard.parachain.active_relayers')}</h1>
          <h2>{totalRelayersPerDay[totalRelayersPerDay.length - 1]?.count}</h2>
        </div>
        {linkButton && (
          <InterlayRouterLink to={PAGES.DASHBOARD_PARACHAIN}>
            <InterlayMulberryOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW RELAYERS
            </InterlayMulberryOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <LineChartComponent
        color='d_interlayMulberry'
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
