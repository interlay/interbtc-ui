import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { HelperText } from '../HelperText';
import { Label, LabelProps } from '../Label';
import { Adornment, BaseInputWrapper, StyledBaseInput, Wrapper } from './Input.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  description?: ReactNode;
  descriptionProps?: HTMLAttributes<HTMLElement>;
  errorMessage?: ReactNode;
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  inputProps?: HTMLAttributes<HTMLInputElement>;
};

type NativeAttrs = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof Props>;

type BaseInputProps = Props & NativeAttrs;

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      className,
      style,
      hidden,
      startAdornment,
      endAdornment,
      label,
      labelProps,
      errorMessage,
      errorMessageProps,
      description,
      descriptionProps,
      disabled,
      ...props
    },
    ref
  ): JSX.Element => {
    const hasErrorMessage = !!errorMessage;
    const hasHelpText = !!description || hasErrorMessage;

    return (
      <Wrapper hidden={hidden} className={className} style={style}>
        {label && <Label {...labelProps}>{label}</Label>}
        <BaseInputWrapper
          $hasStartAdornment={!!startAdornment}
          $hasEndAdornment={!!endAdornment}
          $hasError={hasErrorMessage}
          $isDisabled={disabled}
        >
          {startAdornment && <Adornment>{startAdornment}</Adornment>}
          <StyledBaseInput $isDisabled={disabled} disabled={disabled} ref={ref} type='text' {...props} />
          {endAdornment && <Adornment>{endAdornment}</Adornment>}
        </BaseInputWrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            errorMessage={errorMessage}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
            isDisabled={disabled}
          />
        )}
      </Wrapper>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export { BaseInput };
export type { BaseInputProps };
