import React, { ReactElement } from 'react';
import VaultTable from '../../../common/components/vault-table/vault-table';
import { useTranslation } from 'react-i18next';
import { getAccents } from '../../../pages/dashboard/dashboard-colors';

import ActiveVaults from '../components/active-vaults';
import CollateralLocked from '../components/collateral-locked';
import Collateralization from '../components/collateralization';
import TimerIncrement from '../../../common/components/timer-increment';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

export default function VaultsDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className='main-container dashboard-page'>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <div className='title-container'>
              <h1 className='title-text'>{t('dashboard.vaults.vaults')}</h1>
              <p className='latest-block-text'>
                <TimerIncrement></TimerIncrement>
              </p>
              <div
                style={{ backgroundColor: getAccents('d_blue').color }}
                className='title-line'>
              </div>
            </div>

            <div className='vaults-graphs-container dashboard-graphs-container'>
              <ActiveVaults />
              <CollateralLocked />
              <Collateralization />
            </div>
            <VaultTable></VaultTable>
          </div>
        </div>
      </div>
    </div>
  );
}
