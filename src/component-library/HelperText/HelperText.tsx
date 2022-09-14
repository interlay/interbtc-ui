import { forwardRef, HTMLAttributes } from 'react';

import { StyledHelperText, StyledSubHelperText } from './HelperText.style';

<<<<<<< HEAD
// checks for truthy messages both for string and string[]
=======
// checks for thruthy messages both for string and string[]
>>>>>>> 910a415d (fix(Input): handle error scenarios)
const hasErrorMessage = (errorMessage?: string | string[]): boolean =>
  typeof errorMessage === 'string' ? !!errorMessage : !!errorMessage?.filter(Boolean).length;

type Props = {
  errorMessage?: string | string[];
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  description?: string;
  descriptionProps?: HTMLAttributes<HTMLElement>;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type HelperTextProps = Props & NativeAttrs;

const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  ({ errorMessage, errorMessageProps, description, descriptionProps, ...props }, ref): JSX.Element => {
    const isErrorMessage = hasErrorMessage(errorMessage);

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

export { hasErrorMessage, HelperText };
export type { HelperTextProps };
