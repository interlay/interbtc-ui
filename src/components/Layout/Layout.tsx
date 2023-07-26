import Sidebar from '../../legacy-components/Sidebar';
import Topbar from '../../legacy-components/Topbar';
import { StyledWrapper } from './Layout.styles';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: Props): JSX.Element => (
  <Sidebar className={className}>
    <StyledWrapper>
      <Topbar />
      <main>{children}</main>
    </StyledWrapper>
  </Sidebar>
);

export { Layout };
