import { useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, ReactNode } from 'react';

import { HelperText, HelperTextProps } from '../HelperText';
import { Label, LabelProps } from '../Label';
import { useDOMRef } from '../utils/dom';
import { Adornment, BaseInput, Wrapper } from './Input.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  value?: string;
  defaultValue?: string;
};

type NativeAttrs = Omit<React.InputHTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<LabelProps & HelperTextProps, keyof Props & NativeAttrs>;

type InputProps = Props & NativeAttrs & InheritAttrs;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, hidden, startAdornment, endAdornment, onChange, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(props, inputRef);
    const { label, description, errorMessage } = props;

    const hasHelpText = !!description || !!errorMessage;

    return (
      <div hidden={hidden} className={className} style={style}>
        {label && <Label {...labelProps}>{label}</Label>}
        <Wrapper $hasStartAdornment={!!startAdornment} $hasEndAdornment={!!endAdornment}>
          <Adornment>{startAdornment}</Adornment>
          <BaseInput ref={inputRef} type='text' {...mergeProps(inputProps, { onChange })} />
          <Adornment>{endAdornment}</Adornment>
        </Wrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            errorMessage={errorMessage}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
