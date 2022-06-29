import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTALinkProps extends LinkProps {
  fullWidth?: boolean;
  variant: 'primary' | 'secondary';
}

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ variant, fullWidth = false, className, children, ...rest }, ref): JSX.Element =>
    variant === 'primary' ? (
      <PrimaryCTA as={Link} fullWidth={fullWidth} ref={ref} className={className} {...rest}>
        {children}
      </PrimaryCTA>
    ) : (
      <SecondaryCTA as={Link} fullWidth={fullWidth} ref={ref} className={className} {...rest}>
        {children}
      </SecondaryCTA>
    )
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
