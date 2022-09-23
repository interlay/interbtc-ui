import { ButtonHTMLAttributes, forwardRef } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';
import { SimpleSizes } from '../utils/prop-types';
import { BaseCTA, BaseCTAProps } from './BaseCTA';
import { LoadingWrapper } from './CTA.style';

const loadingSizes: Record<SimpleSizes, number> = {
  small: 16,
  medium: 18,
  large: 20
};

type Props = {
  fullWidth?: boolean;
  size?: SimpleSizes;
  loading?: boolean;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<BaseCTAProps, keyof Props & NativeAttrs>;

type CTAProps = Props & InheritAttrs & NativeAttrs;

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ children, loading, disabled, variant = 'primary', fullWidth, size = 'medium', ...props }, ref): JSX.Element => {
    const isDisabled = disabled || loading;

    return (
      <BaseCTA ref={ref} disabled={isDisabled} fullWidth={fullWidth} variant={variant} size={size} {...props}>
        {loading && (
          <LoadingWrapper>
            <LoadingSpinner
              variant='indeterminate'
              color={variant}
              aria-label='Loading...'
              thickness={2}
              diameter={loadingSizes[size]}
            />
          </LoadingWrapper>
        )}
        {children}
      </BaseCTA>
    );
  }
);

CTA.displayName = 'CTA';

export { CTA };
export type { CTAProps };
