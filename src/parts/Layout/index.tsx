
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useMeasure } from 'react-use';

import Footer from 'parts/Footer';
import TestnetBanner from 'parts/TestnetBanner';
import MaintenanceBanner from 'parts/MaintenanceBanner';
import Topbar from 'common/components/topbar';
import { StoreType } from 'common/types/util.types';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  const address = useSelector((state: StoreType) => state.general.address);
  const [ref, { height: footerHeight }] = useMeasure<HTMLDivElement>();

  const handleRequestDotFromFaucet = async (): Promise<void> => {
    // TODO: should show a descriptive warning
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. ${error.message}`);
    }
  };

  return (
    <div
      className={clsx(
        'relative',
        'min-h-screen'
      )}>
      <main
        style={{ paddingBottom: footerHeight }}
        className={clsx(
          'flex',
          'flex-col'
        )}>
        <Topbar
          address={address}
          requestDOT={handleRequestDotFromFaucet} />
        <TestnetBanner />
        <MaintenanceBanner />
        {children}
      </main>
      <Footer
        ref={ref}
        className={clsx(
          'absolute',
          'bottom-0',
          'w-full',
          'shadow',
          'border-t'
        )} />
    </div>
  );
};

export default Layout;
