
// ray test touch <<
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import BN from 'bn.js';
import clsx from 'clsx';
import { satToBTC } from '@interlay/interbtc';

import DashboardCard from 'pages/dashboard/DashboardCard';
import LineChartComponent from './line-chart-component';
import { getAccents } from '../dashboard-colors';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { PAGES } from 'utils/constants/links';

const InterBTC = (): React.ReactElement => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const totalInterBTC = useSelector((state: StoreType) => state.general.totalInterBTC);

  const { t } = useTranslation();
  const statsApi = useInterbtcIndex();

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

  useEffect(() => {
    if (!statsApi) return;

    (async () => {
      const res = await statsApi.getRecentDailyIssues({ daysBack: 6 });
      setCumulativeIssuesPerDay(res);
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
          <h1 style={{ color: getAccents('d_interlayDenim').color }}>{t('dashboard.issue.issued')}</h1>
          <h2>{t('dashboard.issue.total_interbtc', { amount: displayMonetaryAmount(totalInterBTC) })}</h2>
          {/* TODO: add the price API */}
          <h2>${getUsdAmount(totalInterBTC, prices.bitcoin.usd)}</h2>
        </div>
        <div style={{ display: 'grid', gridRowGap: 10 }}>
          <InterlayRouterLink to={PAGES.DASHBOARD_ISSUE_REQUESTS}>
            <InterlayDenimOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW ALL ISSUED
            </InterlayDenimOutlinedButton>
          </InterlayRouterLink>
          <InterlayRouterLink to={PAGES.DASHBOARD_REDEEM_REQUESTS}>
            <InterlayCaliforniaOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW ALL REDEEMED
            </InterlayCaliforniaOutlinedButton>
          </InterlayRouterLink>
        </div>
      </div>
      <div className='chart-container'>
        <LineChartComponent
          color={['d_interlayCalifornia', 'd_interlayPaleSky']}
          label={[t('dashboard.issue.total_issued_chart'), t('dashboard.issue.per_day_issued_chart')]}
          yLabels={cumulativeIssuesPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={[
            { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
            { position: 'right', maxTicksLimit: 6 }
          ]}
          data={[
            cumulativeIssuesPerDay.slice(1).map(dataPoint => Number(satToBTC(new BN(dataPoint.sat)))),
            pointIssuesPerDay.slice(1).map(sat => Number(satToBTC(new BN(sat))))
          ]} />
      </div>
    </DashboardCard>
  );
};

export default InterBTC;
// ray test touch >>
