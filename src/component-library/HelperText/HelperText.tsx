import { forwardRef, HTMLAttributes } from 'react';

import { StyledHelperText, StyledSubHelperText } from './HelperText.style';

type ErrorMessageProps = HTMLAttributes<HTMLElement> & { isHidden?: boolean };

type DescriptionProps = HTMLAttributes<HTMLElement> & { isHidden?: boolean };

// checks for truthy messages both for string and string[]
const hasErrorMessage = (errorMessage?: string | string[]): boolean =>
  typeof errorMessage === 'string' ? !!errorMessage : !!errorMessage?.filter(Boolean).length;

type Props = {
  errorMessage?: string | string[];
  errorMessageProps?: ErrorMessageProps;
  description?: string;
  descriptionProps?: DescriptionProps;
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

    const { isHidden, ...contentProps } = (isErrorMessage ? errorMessageProps : descriptionProps) || {};

    console.log(errorMessageProps);

    return (
      <StyledHelperText {...props} $hasError={isErrorMessage} $isHidden={isHidden} ref={ref}>
        {isErrorMessage ? (
          <div {...contentProps}>{renderErrorMessage()}</div>
        ) : (
          <div {...contentProps}>{description}</div>
        )}
      </StyledHelperText>
    );
  }
);

HelperText.displayName = 'HelperText';

export { hasErrorMessage, HelperText };
export type { HelperTextProps };
