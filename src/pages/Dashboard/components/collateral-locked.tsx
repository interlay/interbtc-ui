
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';

import LineChartComponent from './line-chart-component';
import DashboardCard from 'pages/Dashboard/DashboardCard';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import {
  getUsdAmount,
  displayMonetaryAmount
} from 'common/utils/utils';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';

interface Props {
  linkButton?: boolean;
}

const CollateralLocked = ({ linkButton }: Props): JSX.Element => {
  const {
    prices,
    totalLockedCollateralTokenAmount
  } = useSelector((state: StoreType) => state.general);

  const { t } = useTranslation();
  const statsApi = useInterbtcIndex();

  const [cumulativeCollateralPerDay, setCumulativeCollateralPerDay] = React.useState(
    // eslint-disable-next-line no-array-constructor
    new Array<{
      date: number;
      amount: number;
    }>()
  );

  React.useEffect(() => {
    if (!statsApi) return;

    (async () => {
      try {
        const result = await statsApi.getRecentDailyCollateralLocked({ daysBack: 6 });
        setCumulativeCollateralPerDay(result);
      } catch (error) {
        console.log('[CollateralLocked] error.message => ', error.message);
      }
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
            {t('dashboard.vault.locked_collateral')}
          </h1>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            {displayMonetaryAmount(totalLockedCollateralTokenAmount)} DOT
          </h2>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            ${getUsdAmount(totalLockedCollateralTokenAmount, prices.collateralToken.usd)}
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
      <div className='mt-5'>
        <LineChartComponent
          color='d_interlayDenim'
          label={t('dashboard.vault.total_collateral_locked') as string}
          yLabels={cumulativeCollateralPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={[
            { beginAtZero: true, precision: 0 }
          ]}
          data={
            cumulativeCollateralPerDay.slice(1).map(dataPoint => dataPoint.amount)
          } />
      </div>
    </DashboardCard>
  );
};

export default CollateralLocked;
