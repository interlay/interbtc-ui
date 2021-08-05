
import InterlayRouterNavLink, { Props as InterlayRouterNavLinkProps } from 'components/UI/InterlayRouterNavLink';
import InterlayLink, { Props as InterlayLinkProps } from 'components/UI/InterlayLink';

interface CustomProps {
  external: boolean;
  href: string;
}

const SidebarNavLink = ({
  external,
  href,
  children,
  ...rest
}: (CustomProps & InterlayRouterNavLinkProps) | (CustomProps & InterlayLinkProps)): JSX.Element => (
  <>
    {external ? (
      <InterlayLink
        href={href}
        {...rest}>
        {children}
      </InterlayLink>
    ) : (
      <InterlayRouterNavLink
        to={href}
        {...rest}>
        {children}
      </InterlayRouterNavLink>
    )}
  </>
);

export default SidebarNavLink;
