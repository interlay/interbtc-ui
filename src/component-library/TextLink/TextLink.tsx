import { forwardRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { Colors, FontSize, FontWeight } from '../utils/prop-types';
import { BaseTextLink, StyledIcon } from './TextLink.style';

type Props = {
  color?: Colors;
  external?: boolean;
  underlined?: boolean;
  size?: FontSize;
  weight?: FontWeight;
  icon?: boolean;
};

type NativeAttrs = Omit<LinkProps, keyof Props | 'href'>;

type TextLinkProps = Props & NativeAttrs;

// TODO: merge this with CTALink
const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ color = 'primary', external, to, underlined, size, weight, icon, children, ...props }, ref): JSX.Element => {
    const location = typeof to === 'string' ? { pathname: to as string } : to;

    const linkProps: TextLinkProps = external
      ? { to: location, target: '_blank', rel: 'noreferrer' }
      : { to: location };

    return (
      <BaseTextLink
        ref={ref}
        as={Link}
        $color={color}
        $underlined={underlined}
        $size={size}
        $weight={weight}
        {...props}
        {...linkProps}
      >
        {children}
        {icon && <StyledIcon color='secondary' />}
      </BaseTextLink>
    );
  }
);

TextLink.displayName = 'TextLink';

export { TextLink };
export type { TextLinkProps };
