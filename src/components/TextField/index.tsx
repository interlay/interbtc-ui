
import * as React from 'react';
import clsx from 'clsx';

import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';

interface CustomProps {
  label?: JSX.Element | string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
}

type Ref = HTMLInputElement;

// eslint-disable-next-line react/display-name
const TextField = React.forwardRef<Ref, Props>(({
  id,
  label,
  error,
  helperText,
  required,
  ...rest
}: Props, ref): JSX.Element => (
  <div>
    {label && (
      <label
        htmlFor={id}
        className={clsx(
          'top-0',
          'left-0',
          'text-sm',
          { 'text-interlayScarlet': error }
        )}>
        {label}
        {required && <span className='ml-0.5'>*</span>}
      </label>
    )}
    <InterlayInput
      ref={ref}
      id={id}
      className={clsx(
        { 'border-interlayScarlet text-interlayScarlet': error }
      )}
      {...rest} />
    {helperText && (
      <p
        className={clsx(
          'text-sm',
          { 'text-interlayScarlet': error }
        )}>
        {helperText}
      </p>
    )}
  </div>
));

export type Props = CustomProps & InterlayInputProps;

export default TextField;
