import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, useEffect } from 'react';

import { useDOMRef } from '@/component-library/utils/dom';

import { BaseInput, BaseInputProps } from '../Input';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
// const defaultFormatOptions: Intl.NumberFormatOptions = {
//   style: 'decimal',
//   maximumFractionDigits: 20,
//   useGrouping: false
// };
// const locale = 'en-US';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

// Prevents the user from changing the input value using mouse wheel
const handleWheel = (event: WheelEvent) => event.preventDefault();

type Props = {
  value?: number | string;
  defaultValue?: number | string;
};

type InheritAttrs = Omit<
  BaseInputProps,
  keyof Props | 'errorMessageProps' | 'descriptionProps' | 'disabled' | 'required' | 'readOnly'
>;

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, (keyof Props & InheritAttrs) | 'onChange'>;

type NumberInputProps = Props & InheritAttrs & AriaAttrs;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, validationState, value, defaultValue, placeholder = '0', ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const { inputProps, descriptionProps, errorMessageProps, labelProps } = useTextField(
      {
        ...props,
        value: value?.toString(),
        defaultValue: defaultValue?.toString(),
        validationState: props.errorMessage ? 'invalid' : validationState
      },
      inputRef
    );

    useEffect(() => {
      const input = inputRef.current;

      input?.addEventListener('wheel', handleWheel, { passive: false });

      return () => input?.removeEventListener('wheel', handleWheel);
    }, [inputRef]);

    // Only emit event when value is valid
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const value = e.target.value.replace(/,/g, '.');
      if (value === '' || inputRegex.test(escapeRegExp(value))) {
        onChange?.(e);
      }
    };

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        inputMode='decimal'
        autoComplete='off'
        autoCorrect='off'
        // text-specific options
        type='text'
        pattern='^[0-9]*[.,]?[0-9]*$'
        placeholder={placeholder}
        minLength={1}
        maxLength={79}
        spellCheck='false'
        {...mergeProps(props, inputProps, { onChange: handleChange })}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
