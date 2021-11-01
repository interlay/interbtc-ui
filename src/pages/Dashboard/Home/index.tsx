
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import WrappedToken from './WrappedToken';
import CollateralLocked from '../CollateralLocked';
import Collateralization from '../Collateralization';
import ParachainSecurity from '../ParachainSecurity';
import BtcRelay from '../components/btc-relay';
import OracleStatus from '../components/oracle-status';
import ActiveVaults from '../components/active-vaults';
import ActiveCollators from './ActiveCollators';

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
        <WrappedToken />
        <CollateralLocked linkButton />
        <Collateralization linkButton />
        <ParachainSecurity linkButton />
        <BtcRelay linkButton />
        <OracleStatus linkButton />
        <ActiveVaults linkButton />
        <ActiveCollators />
      </div>
    </>
  );
};

export default Home;
