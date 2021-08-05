
import {
  NavLink,
  NavLinkProps
} from 'react-router-dom';

const InterlayRouterNavLink = ({
  children,
  ...rest
}: Props): JSX.Element => (
  <NavLink {...rest}>
    {children}
  </NavLink>
);

export type Props = NavLinkProps;

export default InterlayRouterNavLink;
