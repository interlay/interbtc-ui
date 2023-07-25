import clsx from 'clsx';

import Sidebar from '../../legacy-components/Sidebar';
import Topbar from '../../legacy-components/Topbar';
import { MaintenanceBanner } from '../MaintenanceBanner';

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

export { Layout };
