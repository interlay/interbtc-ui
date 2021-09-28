
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { BitcoinAmount } from '@interlay/monetary-js';

import DashboardCard from 'pages/Dashboard/DashboardCard';
import LineChartComponent from './line-chart-component';
import InterlayRouterLink from 'components/UI/InterlayRouterLink';
import InterlayCaliforniaOutlinedButton from 'components/buttons/InterlayCaliforniaOutlinedButton';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import useInterbtcIndex from 'common/hooks/use-interbtc-index';
import { displayMonetaryAmount, getUsdAmount } from 'common/utils/utils';
import { StoreType } from 'common/types/util.types';
import { PAGES } from 'utils/constants/links';

const InterBTC = (): React.ReactElement => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const totalWrappedTokenAmount = useSelector((state: StoreType) => state.general.totalWrappedTokenAmount);

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
          <h1
            className={clsx(
              'text-interlayDenim',
              'text-sm',
              'xl:text-base',
              'mb-1',
              'xl:mb-2'
            )}>
            {t('dashboard.issue.issued')}
          </h1>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            {t('dashboard.issue.total_interbtc', { amount: displayMonetaryAmount(totalWrappedTokenAmount) })}
          </h2>
          {/* TODO: add the price API */}
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            ${getUsdAmount(totalWrappedTokenAmount, prices.bitcoin.usd)}
          </h2>
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
      <div className='mt-5'>
        <LineChartComponent
          color={['d_interlayCalifornia', 'd_interlayPaleSky']}
          label={[t('dashboard.issue.total_issued_chart'), t('dashboard.issue.per_day_issued_chart')]}
          yLabels={cumulativeIssuesPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))
          }
          yAxisProps={[
            { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
            { position: 'right', maxTicksLimit: 6 }
          ]}
          data={[
            cumulativeIssuesPerDay.slice(1).map(
              dataPoint => Number(BitcoinAmount.from.Satoshi(dataPoint.sat).str.BTC())
            ),
            pointIssuesPerDay.slice(1).map(sat => Number(BitcoinAmount.from.Satoshi(sat).str.BTC()))
          ]} />
      </div>
    </DashboardCard>
  );
};

export default InterBTC;
