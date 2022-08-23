import * as React from 'react';

import { Adornment, BaseInput, Wrapper } from './Input.style';

type Props = {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

type NativeAttrs = Omit<React.InputHTMLAttributes<unknown>, keyof Props>;

type InputProps = Props & NativeAttrs;

// TODO: needs to be implemented with react-aria
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ startAdornment, endAdornment, className, style, ...props }, ref): JSX.Element => (
    <Wrapper
      $hasStartAdornment={!!startAdornment}
      $hasEndAdornment={!!endAdornment}
      className={className}
      style={style}
    >
      <Adornment>{startAdornment}</Adornment>
      <BaseInput ref={ref} type='text' {...props} />
      <Adornment>{endAdornment}</Adornment>
    </Wrapper>
  )
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
