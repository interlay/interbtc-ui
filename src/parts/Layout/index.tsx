
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useMeasure } from 'react-use';

import Footer from 'parts/Footer';
import TestnetBanner from 'parts/TestnetBanner';
import MaintenanceBanner from 'parts/MaintenanceBanner';
import Topbar from 'common/components/topbar';
import checkStaticPage from 'config/check-static-page';
import { PAGES } from 'utils/constants/links';
import { StoreType } from 'common/types/util.types';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  const address = useSelector((state: StoreType) => state.general.address);
  const location = useLocation();
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

  /**
   * TODO: a hack for now.
   * - Should apply the gradient on the landing page
   */
  const isHomePage = location.pathname === PAGES.home;

  return (
    <div
      style={{
        //  TODO: should avoid hard-coding colors (https://tailwindcss.com/docs/gradient-color-stops)
        backgroundImage:
          isHomePage ?
            // eslint-disable-next-line max-len
            'linear-gradient(to right bottom, #e1106d, #e52766, #e83761, #ea445b, #eb5157, #ed5952, #ef624e, #f06a4a, #f37143, #f4783c, #f58035, #f5882d)' :
            'unset'
      }}
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
        {!checkStaticPage() && (
          <Topbar
            address={address}
            requestDOT={handleRequestDotFromFaucet} />
        )}
        {!isHomePage && <TestnetBanner />}
        {!isHomePage && <MaintenanceBanner />}
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
