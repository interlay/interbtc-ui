import { ReactElement } from 'react';
import VaultTable from '../../../common/components/vault-table/vault-table';
import { useTranslation } from 'react-i18next';
import { getAccents } from '../../../pages/dashboard/dashboard-colors';

import ActiveVaults from '../components/active-vaults';
import CollateralLocked from '../components/collateral-locked';
import Collateralization from '../components/collateralization';
import TimerIncrement from '../../../common/components/timer-increment';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

export default function VaultsDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <PageTitle
              mainTitle={t('dashboard.vault.vaults')}
              subTitle={<TimerIncrement />} />
            <div
              style={{ backgroundColor: getAccents('d_blue').color }}
              className='title-line' />
            <div className='vaults-graphs-container dashboard-graphs-container'>
              <ActiveVaults />
              <CollateralLocked />
              <Collateralization />
            </div>
            <VaultTable></VaultTable>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
