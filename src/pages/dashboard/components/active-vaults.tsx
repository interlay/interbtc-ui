import { ReactElement, useState, useMemo, useEffect } from 'react';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import LineChartComponent from './line-chart-component';
import useInterbtcIndex from '../../../common/hooks/use-interbtc-index';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import clsx from 'clsx';

type ActiveVaultsProps = {
  linkButton?: boolean;
};

const ActiveVaults = ({ linkButton }: ActiveVaultsProps): ReactElement => {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [totalVaultsPerDay, setTotalVaultsPerDay] = useState(new Array<{ date: number; count: number }>());
  const fetchVaultsPerDay = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyVaultCounts({});
      setTotalVaultsPerDay(res);
    },
    [statsApi] // to silence the compiler
  );

  useEffect(() => {
    fetchVaultsPerDay();
  }, [fetchVaultsPerDay]);
  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          <h1 className='text-interlayDenim'>{t('dashboard.vault.active_vaults')}</h1>
          <h2>{totalVaultsPerDay[totalVaultsPerDay.length - 1]?.count}</h2>
        </div>
        {linkButton && (
          <InterlayRouterLink to={PAGES.DASHBOARD_VAULTS}>
            <InterlayDenimOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW ALL VAULTS
            </InterlayDenimOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <LineChartComponent
        color='d_interlayDenim'
        label={t('dashboard.vault.total_vaults_chart') as string}
        yLabels={totalVaultsPerDay.map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={totalVaultsPerDay.map(dataPoint => dataPoint.count)} />
    </DashboardCard>
  );
};

export default ActiveVaults;
