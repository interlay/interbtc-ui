import { useEffect, ReactElement, useState, useMemo } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboardcolors';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import useInterbtcStats from '../../../common/hooks/use-interbtc-stats';
import { planckToDOT } from '@interlay/interbtc';
import LineChartComponent from './line-chart-component';
import { useTranslation } from 'react-i18next';
import { getUsdAmount } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

type CollateralLockedProps = {
  linkButton?: boolean;
};

const CollateralLocked = ({ linkButton }: CollateralLockedProps): ReactElement => {
  const totalLockedDOT = useSelector((state: StoreType) => state.general.totalLockedDOT);
  const { prices } = useSelector((state: StoreType) => state.general);

  const { t } = useTranslation();
  const statsApi = useInterbtcStats();

  const [cumulativeCollateralPerDay, setCumulativeCollateralPerDay] = useState(
    // eslint-disable-next-line no-array-constructor
    new Array<{ date: number; amount: string }>()
  );

  const fetchCollateralLastDays = useMemo(
    () => async () => {
      try {
        const res = await statsApi.getRecentDailyCollateralLocked(6);
        setCumulativeCollateralPerDay(res.data);
      } catch (error) {
        console.log('Error fetching daily locked collateral.');
        console.log('error.message => ', error.message);
      }
    },
    [statsApi]
  );

  useEffect(() => {
    fetchCollateralLastDays();
  }, [fetchCollateralLastDays]);

  return (
    <DashboardCard>
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 style={{ color: getAccents('d_pink').color }}>{t('dashboard.vault.locked_collateral')}</h1>
          <h2>{totalLockedDOT} DOT</h2>
          <h2>${getUsdAmount(totalLockedDOT, prices.polkadot.usd)}</h2>
        </div>
        {linkButton && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view all vaults'
              propsButtonColor='d_pink'
              buttonId='collateral-locked'
              buttonLink={PAGES.vaults} />
          </div>
        )}
      </div>
      <div className='chart-container'>
        <LineChartComponent
          color='d_pink'
          label={t('dashboard.vault.total_collateral_locked') as string}
          yLabels={cumulativeCollateralPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={[
            { beginAtZero: true, precision: 0 }
          ]}
          data={
            cumulativeCollateralPerDay.slice(1).map(dataPoint => Number(planckToDOT(dataPoint.amount.toString())))
          } />
      </div>
    </DashboardCard>
  );
};

export default CollateralLocked;
