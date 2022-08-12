import * as React from 'react';

import { BaseInput, Wrapper } from './Input.style';

type Props = {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

type NativeAttrs = Omit<React.InputHTMLAttributes<unknown>, keyof Props>;

type InputProps = Props & NativeAttrs;

// TODO: needs to be implemented with react-aria
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ startAdornment, endAdornment, className, style, ...props }, ref): JSX.Element => (
    <Wrapper className={className} style={style}>
      {startAdornment}
      <BaseInput ref={ref} type='text' {...props} />
      {endAdornment}
    </Wrapper>
  )
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
