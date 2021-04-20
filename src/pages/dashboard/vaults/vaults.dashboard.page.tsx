import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import VaultTable from '../../../common/components/vault-table/vault-table';
import ActiveVaults from '../components/active-vaults';
import CollateralLocked from '../components/collateral-locked';
import Collateralization from '../components/collateralization';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

export default function VaultsDashboard(): ReactElement {
  const { t } = useTranslation();

  return (
    <MainContainer
      className={clsx(
        'flex',
        'justify-center',
        'fade-in-animation'
      )}>
      <div className='w-3/4'>
        <div>
          <PageTitle
            mainTitle={t('dashboard.vault.vaults')}
            subTitle={<TimerIncrement />} />
          <div className='title-line bg-interlayBlue' />
          <div className='vaults-graphs-container dashboard-graphs-container'>
            <ActiveVaults />
            <CollateralLocked />
            <Collateralization />
          </div>
          <VaultTable></VaultTable>
        </div>
      </div>
    </MainContainer>
  );
}
