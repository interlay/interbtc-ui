import { useEffect, useMemo, useState } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboard-colors';
import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { satToBTC } from '@interlay/polkabtc';
import LineChartComponent from './line-chart-component';
import { useTranslation } from 'react-i18next';
import { getUsdAmount } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

type PolkaBTCProps = {
  linkButton?: boolean;
};

const PolkaBTC = ({ linkButton }: PolkaBTCProps): React.ReactElement => {
  const { prices } = useSelector((state: StoreType) => state.general);
  const totalPolkaBTC = useSelector((state: StoreType) => state.general.totalPolkaBTC);

  const { t } = useTranslation();
  const statsApi = usePolkabtcStats();

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
      const res = await statsApi.getRecentDailyIssues(6);
      setCumulativeIssuesPerDay(res.data);
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
          <h1 style={{ color: getAccents('d_pink').color }}>{t('dashboard.issue.issued')}</h1>
          <h2>{t('dashboard.issue.total_polkabtc', { amount: totalPolkaBTC })}</h2>
          {/* TODO: add the price API */}
          <h2>${getUsdAmount(totalPolkaBTC, prices.bitcoin.usd)}</h2>
        </div>
        {linkButton && (
          <>
            <div style={{ display: 'grid', gridRowGap: 10 }}>
              <div className='button-container'>
                <ButtonComponent
                  buttonName='view all issued'
                  propsButtonColor='d_pink'
                  buttonId='issuebtn'
                  buttonLink={PAGES.issue} />
              </div>
              <div className='button-container'>
                <ButtonComponent
                  buttonName='view all redeemed'
                  propsButtonColor='d_yellow'
                  buttonId='redeembtn'
                  buttonLink={PAGES.redeem} />
              </div>
            </div>
          </>
        )}
      </div>
      <div className='chart-container'>
        <LineChartComponent
          color={['d_yellow', 'd_grey']}
          label={[t('dashboard.issue.total_issued_chart'), t('dashboard.issue.perday_issued_chart')]}
          yLabels={cumulativeIssuesPerDay
            .slice(1)
            .map(dataPoint => new Date(dataPoint.date).toISOString().substring(0, 10))}
          yAxisProps={[
            { beginAtZero: true, position: 'left', maxTicksLimit: 6 },
            { position: 'right', maxTicksLimit: 6 }
          ]}
          data={[
            cumulativeIssuesPerDay.slice(1).map(dataPoint => Number(satToBTC(dataPoint.sat.toString()))),
            pointIssuesPerDay.slice(1).map(sat => Number(satToBTC(sat.toString())))
          ]} />
      </div>
    </DashboardCard>
  );
};

export default PolkaBTC;
