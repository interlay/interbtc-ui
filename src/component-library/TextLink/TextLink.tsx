import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Colors } from '../utils/prop-types';
import { BaseTextLink } from './TextLink.style';

type Props = {
  color?: Colors;
  external?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props | 'href'>;

type TextLinkProps = Props & NativeAttrs;

// TODO: merge this with CTALink
const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ color = 'primary', external, to, ...props }, ref): JSX.Element => {
    const linkProps: TextLinkProps = external
      ? { to: { pathname: to as string }, target: '_blank', rel: 'noreferrer' }
      : { to };

    return <BaseTextLink ref={ref} as={Link} $color={color} {...props} {...linkProps} />;
  }
);

TextLink.displayName = 'TextLink';

export { TextLink };
export type { TextLinkProps };
