
import { useTranslation } from 'react-i18next';

import LineChart from '../../../LineChart';
import Stats, {
  StatsDt,
  StatsDd
} from '../../../Stats';
import DashboardCard from 'pages/Dashboard/cards/DashboardCard';
import { range } from 'common/utils/utils';

const ActiveCollatorsCard = (): JSX.Element => {
  const { t } = useTranslation();

  // TODO: this function should be removed once real data is pulled in
  const dateToMidnightTemp = (date: Date): Date => {
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
  };

  const data = [3, 3, 3, 3, 3];
  const dates = range(0, 5).map(i =>
    dateToMidnightTemp(new Date(Date.now() - 86400 * 1000 * i))
      .toISOString()
      .substring(0, 10)
  );

  return (
    <DashboardCard>
      <Stats
        leftPart={
          <>
            <StatsDt>
              {t('dashboard.collators.active_collators')}
            </StatsDt>
            <StatsDd>
              3
            </StatsDd>
          </>
        } />
      <LineChart
        colors={['d_interlayDenim']}
        labels={[t('dashboard.collators.total_collators_chart')]}
        yLabels={dates}
        yAxisProps={[{
          beginAtZero: true,
          precision: 0
        }]}
        datasets={[data]} />
    </DashboardCard>
  );
};

export default ActiveCollatorsCard;
