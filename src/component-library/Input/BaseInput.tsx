import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

import { HelperText, HelperTextProps } from '../HelperText';
import { hasErrorMessage } from '../HelperText/HelperText';
import { Label, LabelProps } from '../Label';
import { Sizes } from '../utils/prop-types';
import { Adornment, BaseInputWrapper, StyledBaseInput, Wrapper } from './Input.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  size?: Sizes;
  fontResize: boolean;
  overflow?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type NativeAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>;

type InheritAttrs = Omit<HelperTextProps, keyof Props & NativeAttrs>;

type BaseInputProps = Props & NativeAttrs & InheritAttrs;

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
      size = 'medium',
      overflow = true,
      fontResize,
      ...props
    },
    ref
  ): JSX.Element => {
    const hasError = hasErrorMessage(errorMessage);
    const hasHelpText = !!description || hasError;

    return (
      <Wrapper hidden={hidden} className={className} style={style}>
        {label && <Label {...labelProps}>{label}</Label>}
        <BaseInputWrapper
          $hasStartAdornment={!!startAdornment}
          $hasEndAdornment={!!endAdornment}
          $hasError={hasError}
          $isDisabled={disabled}
          $fontResize={fontResize}
          $size={size}
        >
          {startAdornment && <Adornment>{startAdornment}</Adornment>}
          <StyledBaseInput $size={size} $isOverflow={overflow} disabled={disabled} ref={ref} type='text' {...props} />
          {endAdornment && <Adornment>{endAdornment}</Adornment>}
        </BaseInputWrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            errorMessage={errorMessage}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
          />
        )}
      </Wrapper>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export { BaseInput };
export type { BaseInputProps };
