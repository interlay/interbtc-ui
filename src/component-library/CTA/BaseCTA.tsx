import { forwardRef, HTMLAttributes } from 'react';
import { StyledComponent } from 'styled-components';

import { CTAVariants, Sizes } from '../utils/prop-types';
import { OutlinedCTA, PrimaryCTA, SecondaryCTA, StyledCTAProps, TextCTA } from './CTA.style';

const ctaElements: Record<CTAVariants, StyledComponent<'button', any, StyledCTAProps, never>> = {
  primary: PrimaryCTA,
  secondary: SecondaryCTA,
  outlined: OutlinedCTA,
  text: TextCTA
};

type Props = {
  variant?: CTAVariants;
  fullWidth?: boolean;
  size?: Sizes;
  disabled?: boolean;
  as?: any;
  isFocusVisible?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type BaseCTAProps = Props & NativeAttrs;

const BaseCTA = forwardRef<HTMLElement, BaseCTAProps>(
  (
    { variant = 'primary', fullWidth = false, size = 'medium', children, disabled, isFocusVisible, ...props },
    ref
  ): JSX.Element => {
    const StyledCTA = ctaElements[variant];

    return (
      <StyledCTA
        ref={ref}
        $fullWidth={fullWidth}
        $size={size}
        disabled={disabled}
        $isFocusVisible={isFocusVisible}
        {...props}
      >
        {children}
      </StyledCTA>
    );
  }
);

BaseCTA.displayName = 'BaseCTA';

export { BaseCTA };
export type { BaseCTAProps };
