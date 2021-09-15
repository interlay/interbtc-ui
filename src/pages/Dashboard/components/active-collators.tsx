
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import LineChartComponent from './line-chart-component';
import DashboardCard from 'pages/Dashboard/DashboardCard';
import { range } from 'common/utils/utils';

const ActiveCollators = (): JSX.Element => {
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
            {t('dashboard.collators.active_collators')}
          </h1>
          <h2
            className={clsx(
              'text-base',
              'font-bold',
              'mb-1'
            )}>
            3
          </h2>
        </div>
      </div>
      <LineChartComponent
        color='d_interlayDenim'
        label={t('dashboard.collators.total_collators_chart') as string}
        yLabels={dates}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={data} />
    </DashboardCard>
  );
};

export default ActiveCollators;
