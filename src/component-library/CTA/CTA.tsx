import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef } from 'react';

import { useDOMRef } from '../utils/dom';
import { Colors, CTAVariants, Sizes } from '../utils/prop-types';
import { BaseCTA, BaseCTAProps } from './BaseCTA';
import { LoadingWrapper, StyledLoadingSpinner } from './CTA.style';

// const loadingSizes: Record<Sizes, number> = {
//   small: 16,
//   medium: 18,
//   large: 20
// };

const spinnerVariant: Record<CTAVariants, Colors> = {
  primary: 'secondary',
  secondary: 'primary',
  outlined: 'tertiary',
  text: 'tertiary'
};

// const spinnerSize: Record<Sizes, IconSize> = {
//   small: 's',
//   medium: 'md',
//   large: 'lg'
// };

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
    {
      children,
      loading,
      // disabled,
      variant = 'primary',
      fullWidth,
      size = 'medium',
      onPress,
      onClick,
      // icon: iconProp,
      ...props
    },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);

    // const isDisabled = disabled || loading;
    const isDisabled = false;

    // // TODO: block by Icon change that will affect as well LoadingSpinner
    // const icon = loading ? (
    //   <LoadingSpinner
    //     // variant='indeterminate'
    //     color={spinnerVariant[variant]}
    //     aria-label='Loading...'
    //     thickness={2}
    //     // diameter={loadingSizes[size]}
    //   />
    // ) : (
    //   iconProp
    // );

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
        // icon={icon}
        {...mergeProps(props, buttonProps, focusProps, { onClick })}
      >
        {loading && (
          <LoadingWrapper>
            <StyledLoadingSpinner
              // variant='indeterminate'
              $size={size}
              color={spinnerVariant[variant]}
              aria-label='Loading...'
              thickness={2}
              // diameter={loadingSizes[size]}
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
