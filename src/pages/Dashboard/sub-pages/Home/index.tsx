
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import WrappedTokenCard from './WrappedTokenCard';
import CollateralLockedCard from '../../cards/CollateralLockedCard';
import CollateralizationCard from '../../cards/CollateralizationCard';
import ParachainSecurityCard from '../../cards/ParachainSecurityCard';
import BTCRelayCard from '../../cards/BTCRelayCard';
import OracleStatusCard from '../../cards/OracleStatusCard';
import ActiveVaultsCard from '../../cards/ActiveVaultsCard';
import ActiveCollatorsCard from './ActiveCollatorsCard';

const Home = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle
        mainTitle={t('dashboard.dashboard')}
        subTitle={<TimerIncrement />} />
      <div
        className={clsx(
          'grid',
          'gap-5',
          'grid-cols-1',
          'md:grid-cols-2',
          'lg:gap-10',
          'xl:grid-cols-3'
        )}>
        <WrappedTokenCard />
        <CollateralLockedCard hasLinks />
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
