import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import OracleStatus from '../components/oracle-status';
import OracleTable from '../../../common/components/oracle-table/oracle-table';
import { getAccents } from '../dashboard-colors';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

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
            <div
              style={{ backgroundColor: getAccents('d_blue').color }}
              className='title-line' />
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
