
import { useTranslation } from 'react-i18next';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'common/components/timer-increment';
import Row1 from './rows/row1';
import Row2 from './rows/row2';
import Row3 from './rows/row3';
import './dashboard.page.scss';

function DashboardPage() {
  const { t } = useTranslation();

  return (
    <MainContainer>
      <PageTitle
        mainTitle={t('dashboard.dashboard')}
        subTitle={<TimerIncrement />} />
      {/* TODO: should use flex-grid */}
      <div className='dashboard-items-container'>
        <div className='rows-container'>
          <Row1 />
          <div className='section-div-line' />
          <Row2 />
          <div className='section-div-line' />
          <Row3 />
        </div>
      </div>
    </MainContainer>
  );
}

export default DashboardPage;
