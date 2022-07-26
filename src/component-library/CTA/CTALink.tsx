import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { OutlinedCTA, PrimaryCTA, SecondaryCTA } from './CTA.style';

type Props = {
  variant?: 'primary' | 'secondary' | 'outlined';
  fullWidth?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props>;

type CTALinkProps = Props & NativeAttrs;

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
      default:
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
