
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import InterBTC from './components/interbtc';
import CollateralLocked from './components/collateral-locked';
import Collateralization from './components/collateralization';
import ParachainSecurity from './components/parachain-security';
import BtcRelay from './components/btc-relay';
import OracleStatus from './components/oracle-status';
import ActiveVaults from './components/active-vaults';
import ActiveCollators from './components/active-collators';

const Dashboard = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContainer>
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
        <InterBTC />
        <CollateralLocked linkButton />
        <Collateralization linkButton />
        <ParachainSecurity linkButton />
        <BtcRelay linkButton />
        <OracleStatus linkButton />
        <ActiveVaults linkButton />
        <ActiveCollators />
      </div>
    </MainContainer>
  );
};

export default Dashboard;
