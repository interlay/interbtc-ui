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
  endAdornmentSize?: Sizes | 'extra-large';
  bottomAdornment?: ReactNode;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  size?: Sizes;
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
      endAdornmentSize,
      bottomAdornment,
      label,
      labelProps,
      errorMessage,
      errorMessageProps,
      description,
      descriptionProps,
      disabled,
      size = 'medium',
      ...props
    },
    ref
  ): JSX.Element => {
    const hasError = hasErrorMessage(errorMessage);
    const hasHelpText = !!description || hasError;

    return (
      <Wrapper hidden={hidden} className={className} style={style} $isDisabled={!!disabled}>
        {label && <Label {...labelProps}>{label}</Label>}
        <BaseInputWrapper>
          {startAdornment && <Adornment $position='left'>{startAdornment}</Adornment>}
          <StyledBaseInput
            $size={size}
            disabled={disabled}
            ref={ref}
            type='text'
            $hasBottomAdornment={!!bottomAdornment}
            $hasRightAdornment={!!endAdornment}
            $endAdornmentSize={endAdornmentSize}
            $hasLeftAdornment={!!startAdornment}
            $hasError={hasError}
            $isDisabled={!!disabled}
            {...props}
          />
          {bottomAdornment && <Adornment $position='bottom'>{bottomAdornment}</Adornment>}
          {endAdornment && <Adornment $position='right'>{endAdornment}</Adornment>}
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
