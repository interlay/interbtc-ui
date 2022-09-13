import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Colors } from '../utils/prop-types';
import { BaseTextLink } from './TextLink.style';

type Props = {
  color?: Colors;
  external?: boolean;
  disabled?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props | 'href'>;

type TextLinkProps = Props & NativeAttrs;

const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ color = 'primary', disabled, external, to, ...props }, ref): JSX.Element => {
    const linkProps: TextLinkProps = external ? { to: { pathname: to }, target: '_blank', rel: 'noreferrer' } : { to };

    return (
      <BaseTextLink
        ref={ref}
        as={Link}
        aria-disabled={disabled ? 'true' : undefined}
        $color={color}
        {...props}
        {...linkProps}
      />
    );
  }
);

TextLink.displayName = 'TextLink';

export { TextLink };
export type { TextLinkProps };
