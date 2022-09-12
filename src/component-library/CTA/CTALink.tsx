import { chain } from '@react-aria/utils';
import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { BaseCTA, BaseCTAProps } from './BaseCTA';

type NativeAttrs = LinkProps;

type InheritAttrs = Omit<BaseCTAProps, keyof NativeAttrs>;

type CTALinkProps = InheritAttrs & NativeAttrs;

// TODO: Does this need to be changed to a React Router link component?
const CTALink = forwardRef<HTMLAnchorElement, CTALinkProps>(
  ({ disabled, onClick, ...props }, ref): JSX.Element => {
    const handleClick: React.MouseEventHandler<unknown> = (e) => {
      if (disabled) {
        e.preventDefault();
      }
    };

    return <BaseCTA ref={ref} as={Link} disabled={disabled} onClick={chain(handleClick, onClick)} {...props} />;
  }
);

CTALink.displayName = 'CTALink';

export { CTALink };
export type { CTALinkProps };
