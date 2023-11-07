import { forwardRef, LabelHTMLAttributes } from 'react';

import { LabelPosition } from '../utils/prop-types';
import { StyledLabel } from './Label.style';

type Props = {
  position?: LabelPosition;
};

type NativeAttrs = Omit<LabelHTMLAttributes<unknown>, keyof Props>;

type LabelProps = Props & NativeAttrs;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, position = 'top', ...props }, ref): JSX.Element => (
    <StyledLabel {...props} $position={position} ref={ref}>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
