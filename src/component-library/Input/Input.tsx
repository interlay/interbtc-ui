import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, ReactNode } from 'react';

import { HelperText, HelperTextProps } from '../HelperText';
import { Label, LabelProps } from '../Label';
import { useDOMRef } from '../utils/dom';
import { Adornment, BaseInput, BaseInputWrapper, Wrapper } from './Input.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  value?: string;
  defaultValue?: string;
};

type NativeAttrs = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof Props>;

type InheritAttrs = Omit<
  LabelProps & HelperTextProps & AriaTextFieldOptions<'input'>,
  (keyof Props & NativeAttrs) | 'onChange'
>;

type InputProps = Props & NativeAttrs & InheritAttrs;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, hidden, startAdornment, endAdornment, onChange, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, inputRef);
    const { label, description, errorMessage, isDisabled } = props;

    const hasErrorMessage = !!errorMessage;
    const hasHelpText = !!description || hasErrorMessage;

    return (
      <Wrapper hidden={hidden} className={className} style={style}>
        {label && <Label {...labelProps}>{label}</Label>}
        <BaseInputWrapper
          $hasStartAdornment={!!startAdornment}
          $hasEndAdornment={!!endAdornment}
          $hasError={hasErrorMessage}
          $isDisabled={isDisabled}
        >
          {startAdornment && <Adornment>{startAdornment}</Adornment>}
          <BaseInput $isDisabled={isDisabled} ref={inputRef} type='text' {...mergeProps(inputProps, { onChange })} />
          {endAdornment && <Adornment>{endAdornment}</Adornment>}
        </BaseInputWrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            errorMessage={errorMessage}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
            isDisabled={isDisabled}
          />
        )}
      </Wrapper>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
