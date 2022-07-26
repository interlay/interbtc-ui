import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { OutlinedCTA, PrimaryCTA, SecondaryCTA } from './CTA.style';

interface CTALinkProps extends LinkProps {
  fullWidth?: boolean;
  variant: 'primary' | 'secondary' | 'outlined';
}

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ variant, fullWidth = false, className, children, ...rest }, ref): JSX.Element => {
    const props = {
      as: Link,
      $fullWidth: fullWidth,
      ref,
      className,
      children,
      ...rest
    };

    switch (variant) {
      case 'primary':
        return <PrimaryCTA {...props} />;
      case 'secondary':
        return <SecondaryCTA {...props} />;
      case 'outlined':
        return <OutlinedCTA {...props} />;
    }
  }
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
