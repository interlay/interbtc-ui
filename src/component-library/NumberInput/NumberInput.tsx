import { useNumberField } from '@react-aria/numberfield';
import { mergeProps } from '@react-aria/utils';
import type { NumberFieldStateProps } from '@react-stately/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import { forwardRef, KeyboardEventHandler, useEffect } from 'react';

import { useDOMRef } from '@/component-library/utils/dom';

import { BaseInput, BaseInputProps } from '../Input';

// Prevents the user from changing the input value using mouse wheel
const handleWheel = (event: WheelEvent) => event.preventDefault();

const defaultFormatOptions: Intl.NumberFormatOptions = {
  style: 'decimal',
  maximumFractionDigits: 20,
  useGrouping: false
};

// Static locale for react-stately
// TODO: To be replaced when we manage our locales
const locale = 'en-US';

type Props = {
  value?: number;
  defaultValue?: number;
};

type InheritAttrs = Omit<BaseInputProps, keyof Props | 'disabled' | 'required' | 'readOnly'>;

type AriaAttrs = Omit<NumberFieldStateProps, (keyof Props & InheritAttrs) | 'onChange' | 'locale'>;

type NumberInputProps = Props & InheritAttrs & AriaAttrs;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, formatOptions, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const state = useNumberFieldState({
      ...props,
      formatOptions: formatOptions || defaultFormatOptions,
      locale
    });
    const { inputProps, descriptionProps, errorMessageProps, labelProps } = useNumberField(props, state, inputRef);

    useEffect(() => {
      const input = inputRef.current;

      input?.addEventListener('wheel', handleWheel, { passive: false });

      return () => input?.removeEventListener('wheel', handleWheel);
    }, [inputRef]);

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      // TODO: add key codes to utils
      if (e.code === 'Comma' || e.code === 'Space') {
        e.preventDefault();
      }
    };

    const otherProps: Partial<NumberInputProps> = { onChange, onKeyDown: handleKeyDown };

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        {...mergeProps(props, inputProps, otherProps)}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
