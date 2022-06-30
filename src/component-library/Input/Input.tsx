import * as React from 'react';

import { BaseInput } from './Input.style';

type InputProps = React.ComponentPropsWithRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref): JSX.Element => {
    return <BaseInput ref={ref} {...props} />;
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
