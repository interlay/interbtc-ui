import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import VaultsTable from './VaultsTable';
import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import CollateralLockedCard from '../../cards/CollateralLockedCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import TimerIncrement from 'parts/TimerIncrement';
import PageTitle from 'parts/PageTitle';
import Hr1 from 'components/hrs/Hr1';

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
        <CollateralizationCard />
        {/* ray test touch < */}
        <CollateralLockedCard />
        <CollateralLockedCard />
        <CollateralLockedCard />
        {/* ray test touch > */}
      </div>
      <VaultsTable />
    </>
  );
};

export default Vaults;
