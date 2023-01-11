import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { BaseCTA, BaseCTAProps } from './BaseCTA';

type Props = {
  external?: boolean;
  disabled?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props | 'href'>;

type InheritAttrs = Omit<BaseCTAProps, keyof NativeAttrs & Props>;

type CTALinkProps = Props & NativeAttrs & InheritAttrs;

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ disabled, onClick, external, to, ...props }, ref): JSX.Element => {
    const linkProps: LinkProps = external
      ? { to: { pathname: to as string }, target: '_blank', rel: 'noreferrer' }
      : { to };

    return (
      <BaseCTA
        ref={ref}
        elementType={Link}
        onClick={onClick}
        aria-disabled={disabled ? 'true' : undefined}
        {...props}
        {...linkProps}
      />
    );
  }
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
