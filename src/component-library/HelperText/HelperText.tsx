import { forwardRef, HTMLAttributes } from 'react';

import { hasError } from '../utils/input';
import { StyledHelperText, StyledSubHelperText } from './HelperText.style';

type Props = {
  errorMessage?: string | string[];
  // Used to pass accessiblity props
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  description?: string;
  // Used to pass accessiblity props
  descriptionProps?: HTMLAttributes<HTMLElement>;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type HelperTextProps = Props & NativeAttrs;

const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  ({ errorMessage, errorMessageProps, description, descriptionProps, ...props }, ref): JSX.Element => {
    const isErrorMessage = hasError({ errorMessage });

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
