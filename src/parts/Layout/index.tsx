
import clsx from 'clsx';

import MaintenanceBanner from 'parts/MaintenanceBanner';
import Sidebar from 'parts/Sidebar';
import Topbar from 'parts/Topbar';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({
  className,
  children
}: Props): JSX.Element => {
  return (
    <Sidebar className={className}>
      <div
        className={clsx(
          'relative',
          'min-h-screen'
        )}>
        <MaintenanceBanner />
        <Topbar />
        {children}
      </div>
    </Sidebar>
  );
};

export default Layout;
