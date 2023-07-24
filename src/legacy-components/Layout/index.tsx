import clsx from 'clsx';

import MaintenanceBanner from '../MaintenanceBanner';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: Props): JSX.Element => {
  return (
    <Sidebar className={className}>
      <div className={clsx('relative', 'min-h-screen')}>
        <MaintenanceBanner />
        <Topbar />
        {children}
      </div>
    </Sidebar>
  );
};

export default Layout;
