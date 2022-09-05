import * as React from 'react';

import { StyledLabel } from './Label.style';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type NativeAttrs = Omit<React.LabelHTMLAttributes<unknown>, keyof Props>;

type LabelProps = Props & NativeAttrs;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref): JSX.Element => (
    <StyledLabel {...props} ref={ref}>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
