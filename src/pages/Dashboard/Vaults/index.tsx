
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import VaultsTable from './VaultsTable';
import ActiveVaults from '../components/active-vaults';
import CollateralLocked from '../components/collateral-locked';
import Collateralization from '../components/collateralization';
import TimerIncrement from 'parts/TimerIncrement';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer className='fade-in-animation'>
      <div>
        <PageTitle
          mainTitle={t('dashboard.vault.vaults')}
          subTitle={<TimerIncrement />} />
        <hr
          className={clsx(
            'border-interlayDenim',
            'mt-2'
          )} />
      </div>
      <div
        className={clsx(
          'grid',
          'grid-cols-3',
          'gap-7'
        )}>
        <ActiveVaults />
        <CollateralLocked />
        <Collateralization />
      </div>
      <VaultsTable />
    </MainContainer>
  );
};

export default Vaults;
