import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { forwardRef } from 'react';

import { useDOMRef } from '../utils/dom';
import { BaseInput, BaseInputProps } from './BaseInput';

type Props = {
  value?: string;
  defaultValue?: string;
};

type InheritAttrs = Omit<
  BaseInputProps,
  keyof Props | 'errorMessageProps' | 'descriptionProps' | 'disabled' | 'required' | 'readOnly'
>;

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, (keyof Props & InheritAttrs) | 'onChange'>;

type InputProps = Props & InheritAttrs & AriaAttrs;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const { inputProps, descriptionProps, errorMessageProps, labelProps } = useTextField(props, inputRef);

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        errorMessageProps={errorMessageProps}
        labelProps={labelProps}
        {...mergeProps(props, inputProps, { onChange })}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
