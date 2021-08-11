
import clsx from 'clsx';

import TestnetBanner from 'parts/TestnetBanner';
import MaintenanceBanner from 'parts/MaintenanceBanner';
import Sidebar from 'parts/Sidebar';
import Topbar from 'parts/Topbar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  return (
    <Sidebar>
      <div
        className={clsx(
          'relative',
          'min-h-screen'
        )}>
        <div>
          <Topbar />
          <TestnetBanner />
          <MaintenanceBanner />
          {children}
        </div>
      </div>
    </Sidebar>
  );
};

export default Layout;
