import { useEffect, useMemo, useState } from 'react';
import { getAccents } from '../dashboard-colors';
import useInterbtcIndex from '../../../common/hooks/use-interbtc-index';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { satToBTC } from '@interlay/interbtc';
import LineChartComponent from './line-chart-component';
import { useTranslation } from 'react-i18next';
import { getUsdAmount } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import BN from 'bn.js';

type PolkaBTCProps = {
  linkButton?: boolean;
};

const InterBTC = ({ linkButton }: PolkaBTCProps): React.ReactElement => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const totalPolkaBTC = useSelector((state: StoreType) => state.general.totalPolkaBTC);

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

  const fetchIssuesLastDays = useMemo(
    () => async () => {
      const res = await statsApi.getRecentDailyIssues({ daysBack: 6 });
      setCumulativeIssuesPerDay(res);
    },
    [statsApi] // to silence the compiler
  );

  useEffect(() => {
    fetchIssuesLastDays();
  }, [fetchIssuesLastDays]);

  return (
    <DashboardCard>
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 style={{ color: getAccents('d_interlayDenim').color }}>{t('dashboard.issue.issued')}</h1>
          <h2>{t('dashboard.issue.total_interbtc', { amount: totalPolkaBTC })}</h2>
          {/* TODO: add the price API */}
          <h2>${getUsdAmount(totalPolkaBTC, prices.bitcoin.usd)}</h2>
        </div>
        {linkButton && (
          <>
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
          </>
        )}
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
