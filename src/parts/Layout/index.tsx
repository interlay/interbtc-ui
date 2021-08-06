
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import TestnetBanner from 'parts/TestnetBanner';
import MaintenanceBanner from 'parts/MaintenanceBanner';
import Sidebar from 'parts/Sidebar';
import Topbar from 'parts/Topbar';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import { StoreType } from 'common/types/util.types';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  // ray test touch <<
  const address = useSelector((state: StoreType) => state.general.address);

  const handleRequestDotFromFaucet = async (): Promise<void> => {
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
    }
  };
  // ray test touch >>

  return (
    <Sidebar>
      <div
        className={clsx(
          'relative',
          'min-h-screen'
        )}>
        <div
          className={clsx(
            'flex',
            'flex-col'
          )}>
          {/* ray test touch << */}
          <Topbar
            address={address}
            requestDOT={handleRequestDotFromFaucet} />
          {/* ray test touch >> */}
          <TestnetBanner />
          <MaintenanceBanner />
          {children}
        </div>
      </div>
    </Sidebar>
  );
};

export default Layout;
