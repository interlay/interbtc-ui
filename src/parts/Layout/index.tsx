
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import Footer from 'parts/Footer';
import Topbar from 'common/components/topbar';
import TestnetBanner from 'components/TestnetBanner';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import styles from './layout.module.css';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const address = useSelector((state: StoreType) => state.general.address);
  const location = useLocation();

  const handleRequestDotFromFaucet = async (): Promise<void> => {
    // TODO: should show a descriptive warning
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. You can only use the faucet once every 6 hours. ${error}`);
    }
  };

  // TODO: a hack for now
  const isHomePage = location.pathname === PAGES.HOME;

  return (
    <div
      className={clsx(
        'main d-flex flex-column min-vh-100',
        { [styles['polkabtc-background']]: isHomePage }
      )}>
      {!checkStaticPage() && (
        <Topbar
          address={address}
          requestDOT={handleRequestDotFromFaucet} />
      )}
      {!isHomePage && <TestnetBanner />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
