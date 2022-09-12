import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { StyledHelperText, StyledSubHelperText } from './HelperText.style';

type Props = {
  errorMessage?: ReactNode | ReactNode[];
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  description?: ReactNode;
  descriptionProps: HTMLAttributes<HTMLElement>;
  isDisabled?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type HelperTextProps = Props & NativeAttrs;

const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  ({ errorMessage, errorMessageProps, description, descriptionProps, ...props }, ref): JSX.Element => {
    const isErrorMessage = !!errorMessage;

    const renderErrorMessage = () => {
      if (Array.isArray(errorMessage)) {
        return errorMessage.map((message) => <StyledSubHelperText key={message}>{message}</StyledSubHelperText>);
      }

      return errorMessage;
    };

    return (
      <StyledHelperText {...props} $hasError={isErrorMessage} ref={ref}>
        {isErrorMessage ? (
          <div {...errorMessageProps}>{renderErrorMessage()}</div>
        ) : (
          <div {...descriptionProps}>{description}</div>
        )}
      </StyledHelperText>
    );
  }
);

HelperText.displayName = 'HelperText';

export { HelperText };
export type { HelperTextProps };
