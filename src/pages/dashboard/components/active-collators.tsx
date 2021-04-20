import { ReactElement } from 'react';
import ButtonComponent from './button-component';
import LineChartComponent from './line-chart-component';
import { range } from '../../../common/utils/utils';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

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
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 className='text-interlayBlue'>{t('dashboard.collators.active_collators')}</h1>
          <h2>3</h2>
        </div>
        {displayLinkBtn && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view collators'
              propsButtonColor='d_blue'
              buttonId='active-collators'
              buttonLink={PAGES.home} />
          </div>
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
