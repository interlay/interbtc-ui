import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';
import { useDOMRef } from '../utils/dom';
import { Sizes } from '../utils/prop-types';
import { BaseCTA, BaseCTAProps } from './BaseCTA';
import { LoadingWrapper } from './CTA.style';

const loadingSizes: Record<Sizes, number> = {
  small: 16,
  medium: 18,
  large: 20
};

type Props = {
  fullWidth?: boolean;
  size?: Sizes;
  loading?: boolean;
  onPress?: (e: PressEvent) => void;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<BaseCTAProps, keyof Props & NativeAttrs>;

type CTAProps = Props & InheritAttrs & NativeAttrs;

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  (
    { children, loading, disabled, variant = 'primary', fullWidth, size = 'medium', onPress, onClick, ...props },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);

    const isDisabled = disabled || loading;

    const { buttonProps } = useButton({ isDisabled, onPress, ...props }, domRef);
    const { focusProps, isFocusVisible } = useFocusRing(props);

    return (
      <BaseCTA
        ref={domRef}
        disabled={isDisabled}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        isFocusVisible={isFocusVisible}
        {...mergeProps(props, buttonProps, focusProps, { onClick })}
      >
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
