
import clsx from 'clsx';

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
          {/* ray test touch << */}
          <MaintenanceBanner />
          {/* ray test touch >> */}
          {children}
        </div>
      </div>
    </Sidebar>
  );
};

export default Layout;
