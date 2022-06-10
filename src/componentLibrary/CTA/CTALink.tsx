import { forwardRef } from 'react';

import { PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTALinkProps extends React.ComponentPropsWithRef<'a'> {
  fullWidth?: boolean;
  variant: 'primary' | 'secondary';
}

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ variant, fullWidth = false, className, href, children, ...rest }, ref): JSX.Element =>
    variant === 'primary' ? (
      <PrimaryCTA as='a' fullWidth={fullWidth} ref={ref} href={href} className={className} {...rest}>
        {children}
      </PrimaryCTA>
    ) : (
      <SecondaryCTA as='a' fullWidth={fullWidth} ref={ref} href={href} className={className} {...rest}>
        {children}
      </SecondaryCTA>
    )
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
