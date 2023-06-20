import clsx from 'clsx';

import MaintenanceBanner from '@/parts/MaintenanceBanner';
import Sidebar from '@/parts/Sidebar';
import Topbar from '@/parts/Topbar';

import { StyledLayout } from './Layout.style';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: Props): JSX.Element => {
  return (
    <StyledLayout>
      <Sidebar className={className}>
        <div className={clsx('relative', 'min-h-screen')}>
          <MaintenanceBanner />
          <Topbar />
          {children}
        </div>
      </Sidebar>
    </StyledLayout>
  );
};

export default Layout;
