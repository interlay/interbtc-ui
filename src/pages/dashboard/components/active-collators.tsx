import { ReactElement } from 'react';
import InterlayRouterLink from 'components/UI/InterlayLink/router';
import InterlayDenimOutlinedButton from 'components/buttons/InterlayDenimOutlinedButton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import LineChartComponent from './line-chart-component';
import { range } from '../../../common/utils/utils';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';
import clsx from 'clsx';

const ActiveCollators = (): ReactElement => {
  const { t } = useTranslation();
  // this function should be removed once real data is pulled in
  const dateToMidnightTemp = (date: Date): Date => {
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
  };
  const displayLinkBtn = false;
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
          <h1 className='text-interlayDenim'>{t('dashboard.collators.active_collators')}</h1>
          <h2>3</h2>
        </div>
        {displayLinkBtn && (
          <InterlayRouterLink to={PAGES.HOME}>
            <InterlayDenimOutlinedButton
              endIcon={<FaExternalLinkAlt />}
              className='w-full'>
              VIEW COLLATORS
            </InterlayDenimOutlinedButton>
          </InterlayRouterLink>
        )}
      </div>
      <LineChartComponent
        color='d_blue'
        label={t('dashboard.collators.total_collators_chart') as string}
        yLabels={dates}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={data} />
    </DashboardCard>
  );
};

export default ActiveCollators;
