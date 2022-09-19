import { forwardRef, HTMLAttributes } from 'react';
import { StyledComponent } from 'styled-components';

import { Sizes, Variants } from '../utils/prop-types';
import { OutlinedCTA, PrimaryCTA, SecondaryCTA, StyledCTAProps } from './CTA.style';

const ctaElements: Record<Variants, StyledComponent<'button', any, StyledCTAProps, never>> = {
  primary: PrimaryCTA,
  secondary: SecondaryCTA,
  outlined: OutlinedCTA
};

type Props = {
  variant?: Variants;
  fullWidth?: boolean;
  size?: Sizes;
  disabled?: boolean;
  as?: any;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type BaseCTAProps = Props & NativeAttrs;

const BaseCTA = forwardRef<HTMLElement, BaseCTAProps>(
  ({ variant = 'primary', fullWidth = false, size = 'medium', children, disabled, ...props }, ref): JSX.Element => {
    const StyledCTA = ctaElements[variant];

    return (
      <StyledCTA ref={ref} $fullWidth={fullWidth} $size={size} disabled={disabled} {...props}>
        {children}
      </StyledCTA>
    );
  }
);

BaseCTA.displayName = 'BaseCTA';

export { BaseCTA };
export type { BaseCTAProps };
