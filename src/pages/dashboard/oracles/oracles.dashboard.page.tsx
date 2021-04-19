import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import OracleStatus from '../components/oracle-status';
import OracleTable from '../../../common/components/oracle-table/oracle-table';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function OraclesDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <PageTitle
              mainTitle={t('dashboard.oracles.oracles')}
              subTitle={<TimerIncrement />} />
            <div className='title-line bg-interlayBlue' />
            <div className='dashboard-graphs-container'>
              <OracleStatus />
            </div>
            <OracleTable planckLocked='1' />
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
