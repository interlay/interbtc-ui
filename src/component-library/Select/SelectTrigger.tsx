import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

import { TextProps } from '../Text';
import { useDOMRef } from '../utils/dom';
import { Sizes } from '../utils/prop-types';
import { StyledChevronDown, StyledTrigger, StyledTriggerValue } from './Select.style';

type Props = {
  size?: Sizes;
  isOpen?: boolean;
  hasError?: boolean;
  placeholder?: ReactNode;
  valueProps?: TextProps<unknown>;
  onPress?: (e: PressEvent) => void;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type SelectTriggerProps = Props & NativeAttrs;

// MEMO: this is prune to change when `Select` is added
const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { size = 'medium', hasError, isOpen, children, valueProps, placeholder = 'Select an option', ...props },
    ref
  ): JSX.Element => {
    const { disabled } = props;

    const buttonRef = useDOMRef(ref);

    const { buttonProps } = useButton(props, buttonRef);

    const { focusProps, isFocusVisible } = useFocusRing();

    return (
      <StyledTrigger
        {...mergeProps(buttonProps, focusProps)}
        ref={buttonRef}
        $isDisabled={disabled}
        $size={size}
        $hasError={hasError}
        $isFocusVisible={isFocusVisible}
        $isOpen={isOpen}
      >
        <StyledTriggerValue {...valueProps} $isSelected={!!children} $isDisabled={disabled}>
          {children || placeholder}
        </StyledTriggerValue>
        <StyledChevronDown size={size === 'large' ? 'md' : 's'} />
      </StyledTrigger>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
export type { SelectTriggerProps };
