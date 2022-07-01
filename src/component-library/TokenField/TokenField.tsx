// ray test touch <
import * as React from 'react';

import { TokenFieldLabel, TokenFieldWrapper, TokenFieldInput, TokenFieldUSD } from './TokenField.style';
import { NumberInputProps } from 'component-library/NumberInput';

interface TokenFieldProps extends NumberInputProps {
  label: string;
  approxUSD: string;
}

const TokenField = React.forwardRef<HTMLInputElement, TokenFieldProps>(
  ({ id, label, approxUSD, ...rest }, ref): JSX.Element => {
    return (
      <TokenFieldWrapper>
        <TokenFieldInput
          ref={ref}
          id={id}
          {...rest}
        />
        <TokenFieldLabel>
          {label}
        </TokenFieldLabel>
        <TokenFieldUSD>
          {`≈ $ ${approxUSD}`}
        </TokenFieldUSD>
      </TokenFieldWrapper>
    );
  }
);
TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };
// ray test touch >
