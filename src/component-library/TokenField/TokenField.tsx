import { forwardRef, useEffect, useState } from 'react';

import { NumberInputProps } from '../NumberInput';
import { Stack } from '../Stack';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import {
  StyledTokenBalance,
  TokenAdornment,
  TokenFieldInnerWrapper,
  TokenFieldInput,
  TokenFieldSymbol,
  TokenFieldUSD
} from './TokenField.style';

type Props = {
  tokenSymbol: string;
  valueInUSD: string;
  balance?: string | number;
  balanceInUSD?: string | number;
};

type InheritAttrs = Omit<NumberInputProps, keyof Props>;

type TokenFieldProps = Props & InheritAttrs;

const TokenField = forwardRef<HTMLInputElement, TokenFieldProps>(
  (
    {
      tokenSymbol,
      valueInUSD,
      balance,
      balanceInUSD,
      value: valueProp,
      isDisabled,
      className,
      style,
      hidden,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const [value, setValue] = useState<number | undefined>(valueProp);

    const handleClickBalance = () => {
      const newValue = Number(balance);
      setValue(newValue);
      triggerChangeEvent(inputRef, newValue);
    };

    useEffect(() => {
      if (valueProp === undefined) return;
      setValue(valueProp);
    }, [valueProp]);

    const endAdornment = (
      <TokenAdornment>
        <TokenFieldSymbol>{tokenSymbol}</TokenFieldSymbol>
        <TokenFieldUSD>{`≈ ${valueInUSD}`}</TokenFieldUSD>
      </TokenAdornment>
    );

    return (
      <Stack spacing='half' className={className} style={style} hidden={hidden}>
        {balance && balanceInUSD && (
          <StyledTokenBalance
            tokenSymbol={tokenSymbol}
            value={balance}
            valueInUSD={balanceInUSD}
            onClickBalance={handleClickBalance}
            isDisabled={isDisabled}
          />
        )}
        <TokenFieldInnerWrapper>
          <TokenFieldInput
            ref={inputRef}
            endAdornment={endAdornment}
            value={value}
            isDisabled={isDisabled}
            {...props}
          />
        </TokenFieldInnerWrapper>
      </Stack>
    );
  }
);

TokenField.displayName = 'TokenField';

export { TokenField };
export type { TokenFieldProps };
