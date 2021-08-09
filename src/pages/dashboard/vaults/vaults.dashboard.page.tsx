import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

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
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.vault.vaults')}
          subTitle={<TimerIncrement />} />
        <hr className='border-interlayDenim' />
      </div>
      <div className='grid grid-cols-3 gap-7 mt-10'>
        <ActiveVaults />
        <CollateralLocked />
        <Collateralization />
      </div>
      <VaultTable />
    </MainContainer>
  );
}
