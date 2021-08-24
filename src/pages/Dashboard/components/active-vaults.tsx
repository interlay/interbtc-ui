
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import LineChartComponent from './line-chart-component';
import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { PAGES } from 'utils/constants/links';

interface Props {
  linkButton?: boolean;
}

const ActiveVaults = ({ linkButton }: Props): JSX.Element => {
  const statsApi = useInterbtcIndex();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [totalVaultsPerDay, setTotalVaultsPerDay] = React.useState(new Array<{
    date: number;
    count: number;
  }>());

  React.useEffect(() => {
    if (!statsApi) return;

    (async () => {
      const res = await statsApi.getRecentDailyVaultCounts({});
      setTotalVaultsPerDay(res);
    })();
  }, [statsApi]);

  return (
    <DashboardCard>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <div>
          <h1
            className={clsx(
              'text-interlayDenim',
              'text-sm',
              'xl:text-base',
              'mb-1',
              'xl:mb-2'
            )}>
            {t('dashboard.vault.active_vaults')}
          </h1>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            {totalVaultsPerDay[totalVaultsPerDay.length - 1]?.count}
          </h2>
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
