import { AnchorHTMLAttributes, forwardRef } from 'react';

import { Colors } from '../utils/prop-types';
import { StyledAnchor } from './Link.style';

type Props = {
  color?: Colors;
  as?: any;
};

type NativeAttrs = Omit<AnchorHTMLAttributes<unknown>, keyof Props>;

type LinkProps = Props & NativeAttrs;

// TODO: improve type to handle polymorphism in case ´as´ is react-router Link
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ color = 'primary', as, ...props }, ref): JSX.Element => (
    <StyledAnchor as={as} $color={color} ref={ref} {...props} />
  )
);

Link.displayName = 'Link';

export { Link };
export type { LinkProps };
