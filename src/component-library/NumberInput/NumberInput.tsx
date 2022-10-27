import { useNumberField } from '@react-aria/numberfield';
import { mergeProps } from '@react-aria/utils';
import type { NumberFieldStateProps } from '@react-stately/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';
import { ChangeEventHandler, forwardRef, useEffect, useState } from 'react';

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

    const [resize, setResize] = useState({ state: false, position: 0 });

    useEffect(() => {
      const input = inputRef.current;

      input?.addEventListener('wheel', handleWheel, { passive: false });

      return () => input?.removeEventListener('wheel', handleWheel);
    }, [inputRef]);

    // Sets input to resize at a certain conditions
    useEffect(() => {
      const inputEl = inputRef.current;

      if (!inputEl) return;

      // purposely used value here so it is included in
      // the useEffect deps array
      const value = inputProps.value as string;

      // Condition is true when input text overflows available width
      if (!resize.state && inputEl.clientWidth < inputEl.scrollWidth) {
        return setResize({ state: true, position: value.length });
      }

      // Checks if was are back at the position when resize happened.
      if (resize.state && value.length < resize.position) {
        return setResize({ state: false, position: 0 });
      }
    }, [inputProps.value, inputRef, resize.position, resize.state]);

    // Only emit event when value is valid
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if ((e.target as HTMLInputElement).value.match(/^[0-9]*[.]?[0-9]*$/)) {
        onChange?.(e);
      }
    };

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        resize={resize.state}
        {...mergeProps(props, inputProps, { onChange: handleChange })}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
