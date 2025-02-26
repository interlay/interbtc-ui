import Sidebar from '../../legacy-components/Sidebar';
import Topbar from '../../legacy-components/Topbar';
import { AppAlert } from '../AppAlert';
import { StyledWrapper } from './Layout.styles';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: Props): JSX.Element => (
  <>
    <AppAlert alertText='Ledger is not supported on Interlay. Please don&apos;t use Ledger to store your tokens.'/>
    <Sidebar className={className}>
      <StyledWrapper>
        <Topbar />
        <main>{children}</main>
      </StyledWrapper>
    </Sidebar>
  </>
);

export { Layout };
