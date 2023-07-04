import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import InterlayLink, { Props as InterlayLinkProps } from '@/legacy-components/UI/InterlayLink';
import InterlayRouterNavLink, {
  Props as InterlayRouterNavLinkProps
} from '@/legacy-components/UI/InterlayRouterNavLink';

interface CustomProps {
  external?: boolean;
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
      <InterlayLink className={clsx('hover:no-underline', className)} href={href} {...rest}>
        {children}
        <ArrowTopRightOnSquareIcon className={clsx('flex-shrink-0', 'w-4', 'h-4', 'ml-1')} />
      </InterlayLink>
    ) : (
      <InterlayRouterNavLink className={className} to={href} {...rest}>
        {children}
      </InterlayRouterNavLink>
    )}
  </>
);

export default SidebarNavLink;
