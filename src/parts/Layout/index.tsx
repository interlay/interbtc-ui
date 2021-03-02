
import {
  useSelector
} from 'react-redux';
import { toast } from 'react-toastify';

import Topbar from 'common/components/topbar';
import Footer from 'common/components/footer/footer';
import checkStaticPage from 'config/check-static-page';
import { StoreType } from 'common/types/util.types';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const address = useSelector((state: StoreType) => state.general.address);

  const handleRequestDotFromFaucet = async (): Promise<void> => {
    // TODO: should show a descriptive warning
    if (!address) return;

    try {
      const receiverId = window.polkaBTC.api.createType('AccountId', address);
      await window.faucet.fundAccount(receiverId);
      toast.success('Your account has been funded.');
    } catch (error) {
      toast.error(`Funding failed. You can only use the faucet once every 6 hours. ${error}`);
    }
  };

  return (
    <div className='main d-flex flex-column min-vh-100 polkabtc-background fade-in-animation'>
      {!checkStaticPage() && (
        <Topbar
          address={address}
          requestDOT={handleRequestDotFromFaucet} />
      )}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
