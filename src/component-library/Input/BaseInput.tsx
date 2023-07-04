import { ValidationState } from '@react-types/shared';
import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { Field, useFieldProps } from '../Field';
import { HelperTextProps } from '../HelperText';
import { LabelProps } from '../Label';
import { hasError } from '../utils/input';
import { Sizes, Spacing } from '../utils/prop-types';
import { Adornment, StyledBaseInput } from './Input.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  bottomAdornment?: ReactNode;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  size?: Sizes;
  // TODO: temporary
  padding?: { top?: Spacing; bottom?: Spacing; left?: Spacing; right?: Spacing };
  validationState?: ValidationState;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type NativeAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>;

type InheritAttrs = Omit<HelperTextProps, keyof Props & NativeAttrs>;

type BaseInputProps = Props & NativeAttrs & InheritAttrs;

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { startAdornment, endAdornment, bottomAdornment, disabled, size = 'medium', validationState, padding, ...props },
    ref
  ): JSX.Element => {
    const endAdornmentRef = useRef<HTMLDivElement>(null);
    const [endAdornmentWidth, setEndAdornmentWidth] = useState(0);

    const { fieldProps, elementProps } = useFieldProps(props);

    useEffect(() => {
      if (!endAdornmentRef.current || !endAdornment) return;

      setEndAdornmentWidth(endAdornmentRef.current.getBoundingClientRect().width);
    }, [endAdornment]);

    const error = hasError({ validationState, errorMessage: props.errorMessage });

    return (
      <Field {...fieldProps}>
        {startAdornment && <Adornment $position='left'>{startAdornment}</Adornment>}
        <StyledBaseInput
          ref={ref}
          type='text'
          disabled={disabled}
          $size={size}
          $adornments={{ bottom: !!bottomAdornment, left: !!startAdornment, right: !!endAdornment }}
          $hasError={error}
          $isDisabled={!!disabled}
          $endAdornmentWidth={endAdornmentWidth}
          $padding={padding}
          {...elementProps}
        />
        {bottomAdornment && <Adornment $position='bottom'>{bottomAdornment}</Adornment>}
        {endAdornment && (
          <Adornment ref={endAdornmentRef} $position='right'>
            {endAdornment}
          </Adornment>
        )}
      </Field>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export { BaseInput };
export type { BaseInputProps };
