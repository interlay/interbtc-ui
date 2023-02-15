import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, useEffect, useState } from 'react';

import { useDOMRef } from '@/component-library/utils/dom';

import { BaseInput, BaseInputProps } from '../Input';

const escapeRegExp = (string: string): string => {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// match escaped "." characters via in a non-capturing group
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

type Props = {
  value?: string | number;
  defaultValue?: string | number;
};

type InheritAttrs = Omit<
  BaseInputProps,
  keyof Props | 'errorMessageProps' | 'descriptionProps' | 'disabled' | 'required' | 'readOnly'
>;

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, (keyof Props & InheritAttrs) | 'onChange'>;

type NumberInputProps = Props & InheritAttrs & AriaAttrs;

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, validationState, value: valueProp, defaultValue = '', ...props }, ref): JSX.Element => {
    const [value, setValue] = useState<string | undefined>(defaultValue?.toString());
    const inputRef = useDOMRef(ref);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const value = e.target.value;

      if (inputRegex.test(escapeRegExp(value))) {
        onChange?.(e);
        setValue(value);
      }
    };

    const { inputProps, descriptionProps, errorMessageProps, labelProps } = useTextField(
      {
        ...props,
        validationState: props.errorMessage ? 'invalid' : validationState,
        value: value,
        pattern: '^[0-9]*[.,]?[0-9]*$',
        inputMode: 'decimal',
        autoComplete: 'off',
        minLength: 1,
        maxLength: 79
      },
      inputRef
    );

    useEffect(() => {
      if (valueProp === undefined) return;

      setValue(valueProp.toString());
    }, [valueProp]);

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        autoCorrect='off'
        spellCheck='false'
        {...mergeProps(props, inputProps, { onChange: handleChange })}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
export type { NumberInputProps };
