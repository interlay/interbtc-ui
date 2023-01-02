import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { StyledComponent } from 'styled-components';

import { CTAVariants, ElementTypeProp, Sizes } from '../utils/prop-types';
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
  isFocusVisible?: boolean;
  icon?: ReactNode;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type BaseCTAProps = Props & NativeAttrs & ElementTypeProp;

const BaseCTA = forwardRef<HTMLElement, BaseCTAProps>(
  (
    {
      variant = 'primary',
      fullWidth = false,
      size = 'medium',
      children: childrenProp,
      icon,
      disabled,
      elementType,
      isFocusVisible,
      ...props
    },
    ref
  ): JSX.Element => {
    const StyledCTA = ctaElements[variant];

    const children = icon || childrenProp;

    return (
      <StyledCTA
        ref={ref}
        as={elementType}
        $fullWidth={fullWidth}
        $size={size}
        disabled={disabled}
        $isFocusVisible={isFocusVisible}
        $hasIcon={!!icon}
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
