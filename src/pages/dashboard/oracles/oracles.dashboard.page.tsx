import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import OracleStatus from '../components/oracle-status';
import OracleTable from '../../../common/components/oracle-table/oracle-table';
import { getAccents } from '../dashboard-colors';
import TimerIncrement from '../../../common/components/timer-increment';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

export default function OraclesDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className='dashboard-page main-container'>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <div className='title-container'>
              <h1 className='title-text'>{t('dashboard.oracles.oracles')}</h1>
              <p className='latest-block-text'>
                <TimerIncrement></TimerIncrement>
              </p>
              <div
                style={{ backgroundColor: getAccents('d_blue').color }}
                className='title-line'>
              </div>
            </div>

            <div className='dashboard-graphs-container'>
              <OracleStatus />
            </div>
            <OracleTable planckLocked='1' />
          </div>
        </div>
      </div>
    </div>
  );
}
