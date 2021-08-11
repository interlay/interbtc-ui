
import clsx from 'clsx';
import { ExternalLinkIcon } from '@heroicons/react/outline';

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
  className,
  ...rest
}: (CustomProps & InterlayRouterNavLinkProps) | (CustomProps & InterlayLinkProps)): JSX.Element => (
  <>
    {external ? (
      <InterlayLink
        className={clsx(
          'hover:no-underline',
          className
        )}
        href={href}
        {...rest}>
        {children}
        <ExternalLinkIcon
          className={clsx(
            'flex-shrink-0',
            'w-4',
            'h-4',
            'ml-1'
          )} />
      </InterlayLink>
    ) : (
      <InterlayRouterNavLink
        className={className}
        to={href}
        {...rest}>
        {children}
      </InterlayRouterNavLink>
    )}
  </>
);

export default SidebarNavLink;
