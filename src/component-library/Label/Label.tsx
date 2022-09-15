import { forwardRef, LabelHTMLAttributes } from 'react';

import { StyledLabel } from './Label.style';

type NativeAttrs = LabelHTMLAttributes<unknown>;

type LabelProps = NativeAttrs;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref): JSX.Element => (
    <StyledLabel {...props} ref={ref}>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
