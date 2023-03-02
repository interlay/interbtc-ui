import { forwardRef, LabelHTMLAttributes } from 'react';

import { StyledLabel } from './Label.style';

type Props = {
  isVisuallyHidden?: boolean;
};

type NativeAttrs = Omit<LabelHTMLAttributes<unknown>, keyof Props>;

type LabelProps = Props & NativeAttrs;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, isVisuallyHidden, ...props }, ref): JSX.Element => (
    <StyledLabel {...props} $isVisuallyHidden={isVisuallyHidden} ref={ref}>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
