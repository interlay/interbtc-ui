import { ReactElement } from 'react';
import TimerIncrement from '../../common/components/timer-increment';
import { useTranslation } from 'react-i18next';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

import './dashboard.page.scss';
import Row1 from './rows/row1';
import Row2 from './rows/row2';
import Row3 from './rows/row3';

export default function DashboardPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <MainContainer>
      <PageTitle
        mainTitle={t('dashboard.dashboard')}
        subTitle={<TimerIncrement />} />
      <div className='dashboard-items-container'>
        <div className='rows-container'>
          <Row1 />
          <div className='section-div-line'></div>
          <Row2 />
          <div className='section-div-line'></div>
          <Row3 />
        </div>
      </div>
    </MainContainer>
  );
}
