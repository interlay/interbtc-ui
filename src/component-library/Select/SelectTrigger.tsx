import { useButton } from '@react-aria/button';
import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

import { TextProps } from '../Text';
import { useDOMRef } from '../utils/dom';
import { Sizes } from '../utils/prop-types';
import { StyledChevronDown, StyledTrigger, StyledTriggerValue } from './Select.style';

type Props = {
  as?: any;
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
    {
      as,
      size = 'medium',
      hasError = false,
      isOpen,
      children,
      valueProps,
      placeholder = 'Select an option',
      name,
      ...props
    },
    ref
  ): JSX.Element => {
    const { disabled } = props;

    const buttonRef = useDOMRef(ref);

    const { buttonProps } = useButton({ ...props, isDisabled: disabled }, buttonRef);
    const Comp = as || StyledTrigger;

    return (
      <Comp
        {...buttonProps}
        ref={buttonRef}
        $isDisabled={!!disabled}
        $size={size}
        $hasError={hasError}
        $isOpen={isOpen}
        name={name}
      >
        <StyledTriggerValue {...valueProps} $isSelected={!!children} $isDisabled={disabled}>
          {children || placeholder}
        </StyledTriggerValue>
        <StyledChevronDown size={size === 'large' ? 'md' : 's'} />
      </Comp>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
export type { SelectTriggerProps };
