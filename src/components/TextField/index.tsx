
import * as React from 'react';
import clsx from 'clsx';

import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';

interface CustomTextFieldProps {
  label?: JSX.Element | string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
const TextField = React.forwardRef<Ref, Props>(({
  id,
  label,
  error,
  helperText,
  required,
  ...rest
}: Props, ref): JSX.Element => (
  <div>
    {label && (
      <TextFieldLabel
        htmlFor={id}
        required={required}
        error={error}>
        {label}
      </TextFieldLabel>
    )}
    <InterlayInput
      ref={ref}
      id={id}
      className={clsx(
        { 'border-interlayScarlet text-interlayScarlet': error }
      )}
      {...rest} />
    {helperText && (
      <TextFieldHelperText error={error}>
        {helperText}
      </TextFieldHelperText>
    )}
  </div>
));

interface CustomTextFieldLabelProps {
  required?: boolean;
  error?: boolean;
}

const TextFieldLabel = ({
  children,
  required,
  className,
  error,
  ...rest
}: CustomTextFieldLabelProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label
    className={clsx(
      'text-sm',
      'space-x-0.5',
      { 'text-interlayScarlet': error },
      className
    )}
    {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

interface CustomTextFieldHelperTextProps {
  error?: boolean;
}

const TextFieldHelperText = ({
  className,
  error,
  ...rest
}: CustomTextFieldHelperTextProps & React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      'text-sm',
      { 'text-interlayScarlet': error },
      className
    )}
    {...rest} />
);

export {
  TextFieldLabel,
  TextFieldHelperText
};

export type Props = CustomTextFieldProps & InterlayInputProps;

export default TextField;
