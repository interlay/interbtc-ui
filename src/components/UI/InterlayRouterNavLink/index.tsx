
import {
  NavLink,
  NavLinkProps
} from 'react-router-dom';

const InterlayRouterNavLink = ({
  children,
  ...rest
}: NavLinkProps): JSX.Element => (
  <NavLink {...rest}>
    {children}
  </NavLink>
);

export default InterlayRouterNavLink;
