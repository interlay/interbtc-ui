
import * as React from 'react';
import clsx from 'clsx';

import {
  TextFieldHelperText,
  TextFieldLabel,
  TextFieldContainer
} from 'components/TextField';
import InterlayInput, { Props as InterlayInputProps } from 'components/UI/InterlayInput';

interface CustomInterBTCFieldProps {
  label: string;
  error?: boolean;
  helperText?: JSX.Element | string;
  required?: boolean;
  approxUSD: string;
}

type Ref = HTMLInputElement;
const InterBTCField = React.forwardRef<Ref, CustomInterBTCFieldProps & InterlayInputProps>(({
  id,
  label,
  error,
  helperText,
  required,
  approxUSD,
  ...rest
}, ref): JSX.Element => {
  return (
    <div className='space-y-1.5'>
      <TextFieldContainer className='relative'>
        <InterlayInput
          ref={ref}
          id={id}
          className={clsx(
            'text-5xl',
            'pr-36',
            {
              [clsx(
                'border-interlayCinnabar',
                'text-interlayCinnabar'
              )]: error
            }
          )}
          {...rest} />
        <TextFieldLabel
          className={clsx(
            'text-2xl',
            'text-gray-400',
            'font-medium',
            'absolute',
            'right-4',
            'top-2'
          )}
          required={required}>
          {label}
        </TextFieldLabel>
        <span
          className={clsx(
            'block',
            'text-xl',
            'text-textSecondary',
            'text-right',
            'absolute',
            'right-4',
            'bottom-2'
          )}>
          {approxUSD}
        </span>
      </TextFieldContainer>
      <TextFieldHelperText
        className={clsx(
          { 'text-interlayCinnabar': error }
        )}>
        {helperText}
      </TextFieldHelperText>
    </div>
  );
});
InterBTCField.displayName = 'InterBTCField';

export default InterBTCField;
