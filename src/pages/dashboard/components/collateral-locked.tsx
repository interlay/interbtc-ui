import { useEffect, ReactElement, useState, useMemo } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboardcolors';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import { planckToDOT } from '@interlay/polkabtc';
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
  const statsApi = usePolkabtcStats();

  const [cumulativeCollateralPerDay, setCumulativeCollateralPerDay] = useState(
    // eslint-disable-next-line no-array-constructor
    new Array<{ date: number; amount: number }>()
  );
  const pointCollateralPerDay = useMemo(
    () =>
      cumulativeCollateralPerDay.map((dataPoint, i) => {
        if (i === 0) return 0;
        return dataPoint.amount - cumulativeCollateralPerDay[i - 1].amount;
      }),
    [cumulativeCollateralPerDay]
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
          color={['d_pink', 'd_grey']}
          label={[t('dashboard.vault.total_collateral_locked'), t('dashboard.vault.perday_collateral_locked')]}
          yLabels={cumulativeCollateralPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={[
            { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
            { position: 'right', maxTicksLimit: 5 }
          ]}
          data={[
            cumulativeCollateralPerDay.slice(1).map(dataPoint => Number(planckToDOT(dataPoint.amount.toString()))),
            pointCollateralPerDay.slice(1).map(amount => Number(planckToDOT(amount.toString())))
          ]} />
      </div>
    </DashboardCard>
  );
};

export default CollateralLocked;
