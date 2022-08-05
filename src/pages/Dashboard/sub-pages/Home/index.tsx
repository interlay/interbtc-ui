import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import PageTitle from '@/parts/PageTitle';
import TimerIncrement from '@/parts/TimerIncrement';

import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import BTCRelayCard from '../../cards/BTCRelayCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import OracleStatusCard from '../../cards/OracleStatusCard';
import ParachainSecurityCard from '../../cards/ParachainSecurityCard';
import ActiveCollatorsCard from './ActiveCollatorsCard';
import LockedCollateralsCard from './LockedCollateralsCard';
import WrappedTokenCard from './WrappedTokenCard';

const Home = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle mainTitle={t('dashboard.dashboard')} subTitle={<TimerIncrement />} />
      <div className={clsx('grid', 'gap-5', 'grid-cols-1', 'md:grid-cols-2', 'lg:gap-10', 'xl:grid-cols-3')}>
        <WrappedTokenCard />
        <LockedCollateralsCard />
        <CollateralizationCard hasLinks />
        <ParachainSecurityCard hasLinks />
        <BTCRelayCard hasLinks />
        <OracleStatusCard hasLinks />
        <ActiveVaultsCard hasLinks />
        <ActiveCollatorsCard />
      </div>
    </>
  );
};

export default Home;
