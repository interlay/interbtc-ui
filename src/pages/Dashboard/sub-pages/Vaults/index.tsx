import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import Hr1 from '@/components/hrs/Hr1';
import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import CollateralLockedCard from '../../cards/CollateralLockedCard';
import VaultsTable from './VaultsTable';

const Vaults = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <PageTitle mainTitle={t('dashboard.vault.vaults')} subTitle={<TimerIncrement />} />
        <Hr1 className='mt-2' />
      </div>
      <div className={clsx('grid', 'grid-cols-3', 'gap-7')}>
        <ActiveVaultsCard />
        <CollateralLockedCard />
        <CollateralizationCard />
      </div>
      <VaultsTable />
    </>
  );
};

export default Vaults;
