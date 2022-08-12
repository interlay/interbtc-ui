import { ButtonHTMLAttributes, forwardRef } from 'react';

import { CTAVariants, Sizes } from '../utils/prop-types';
import { OutlinedCTA, PrimaryCTA, SecondaryCTA } from './CTA.style';

type Props = {
  variant?: CTAVariants;
  fullWidth?: boolean;
  size?: Sizes;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type CTAProps = Props & NativeAttrs;

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  (
    { disabled = false, variant, fullWidth = false, size = 'medium', onClick, className, children, ...rest },
    ref
  ): JSX.Element => {
    const props = {
      as: 'button' as keyof JSX.IntrinsicElements,
      disabled,
      $fullWidth: fullWidth,
      ref,
      onClick,
      className,
      children,
      $size: size,
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

CTA.displayName = 'CTA';

export { CTA };
export type { CTAProps };
