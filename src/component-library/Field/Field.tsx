import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { Flex } from '../Flex';
import { HelperText, HelperTextProps } from '../HelperText';
import { hasErrorMessage } from '../HelperText/HelperText';
import { Label, LabelProps } from '../Label';
import { Wrapper } from './Field.style';

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<HelperTextProps, keyof Props & NativeAttrs>;

type FieldProps = Props & NativeAttrs & InheritAttrs;

const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    { label, labelProps, errorMessage, errorMessageProps, description, descriptionProps, children, ...props },
    ref
  ): JSX.Element => {
    const hasError = hasErrorMessage(errorMessage);
    const hasHelpText = !!description || hasError;

    return (
      <Flex ref={ref} direction='column' {...props}>
        {label && <Label {...labelProps}>{label}</Label>}
        <Wrapper alignItems='center'>{children}</Wrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            errorMessage={errorMessage}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
          />
        )}
      </Flex>
    );
  }
);

Field.displayName = 'Field';

const useFieldProps = ({
  label,
  labelProps,
  errorMessage,
  errorMessageProps,
  description,
  descriptionProps,
  className,
  hidden,
  style,
  ...props
}: FieldProps): { fieldProps: FieldProps; elementProps: any } => {
  return {
    fieldProps: {
      label,
      labelProps,
      errorMessage,
      errorMessageProps,
      description,
      descriptionProps,
      className,
      hidden,
      style
    },
    elementProps: props
  };
};

export { Field, useFieldProps };
export type { FieldProps };
