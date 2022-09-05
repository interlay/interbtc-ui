import * as React from 'react';

import { StyledHelperText } from './HelperText.style';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>;

type HelperTextProps = Props & NativeAttrs;

const HelperText = React.forwardRef<HTMLDivElement, HelperTextProps>(
  ({ children, ...props }, ref): JSX.Element => (
    <StyledHelperText {...props} ref={ref}>
      {children}
    </StyledHelperText>
  )
);

HelperText.displayName = 'HelperText';

export { HelperText };
export type { HelperTextProps };
