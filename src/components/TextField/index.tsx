
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

const TextField = React.forwardRef<Ref, Props>(({
  id,
  label,
  error,
  helperText,
  required,
  ...rest
}, ref): JSX.Element => (
  <TextFieldContainer>
    {label && (
      <TextFieldLabel
        htmlFor={id}
        required={required}
        className={clsx(
          { 'text-interlayScarlet': error }
        )}>
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
      <TextFieldHelperText
        className={clsx(
          { 'text-interlayScarlet': error }
        )}>
        {helperText}
      </TextFieldHelperText>
    )}
  </TextFieldContainer>
));
TextField.displayName = 'TextField';

const TextFieldContainer = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div {...props} />
);

interface CustomTextFieldLabelProps {
  required?: boolean;
}

const TextFieldLabel = ({
  children,
  required,
  className,
  ...rest
}: CustomTextFieldLabelProps & React.ComponentPropsWithRef<'label'>): JSX.Element => (
  <label
    className={clsx(
      'text-sm',
      'space-x-0.5',
      className
    )}
    {...rest}>
    <span>{children}</span>
    {required && <span>*</span>}
  </label>
);

const TextFieldHelperText = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'p'>): JSX.Element => (
  <p
    className={clsx(
      'text-sm',
      className
    )}
    {...rest} />
);

export {
  TextFieldLabel,
  TextFieldHelperText,
  TextFieldContainer
};

export type Props = CustomTextFieldProps & InterlayInputProps;

export default TextField;
