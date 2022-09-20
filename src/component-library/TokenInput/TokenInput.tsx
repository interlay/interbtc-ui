import { chain } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, useEffect, useState } from 'react';

import { NumberInputProps } from '../NumberInput';
import { Stack } from '../Stack';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import {
  StyledTokenBalance,
  TokenAdornment,
  TokenInputInnerWrapper,
  TokenInputInput,
  TokenInputSymbol,
  TokenInputUSD
} from './TokenInput.style';

type Props = {
  tokenSymbol: string;
  valueInUSD: string;
  balance?: string | number;
  balanceInUSD?: string | number;
};

type InheritAttrs = Omit<NumberInputProps, keyof Props>;

type TokenInputProps = Props & InheritAttrs;

const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  (
    {
      tokenSymbol,
      valueInUSD,
      balance,
      balanceInUSD,
      isDisabled,
      className,
      style,
      hidden,
      value: valueProp,
      onChange,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const [value, setValue] = useState<number | undefined>(valueProp);

    const handleClickBalance = () => {
      const newValue = Number(balance);
      triggerChangeEvent(inputRef, newValue);
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const unparsedValue = e.target.value;

      if (!unparsedValue) {
        return setValue(undefined);
      }

      const parsedValue = Number(unparsedValue.replaceAll(',', ''));
      setValue(parsedValue);
    };

    useEffect(() => {
      if (valueProp === undefined) return;
      setValue(valueProp);
    }, [valueProp]);

    const endAdornment = (
      <TokenAdornment>
        <TokenInputSymbol>{tokenSymbol}</TokenInputSymbol>
        <TokenInputUSD>{`≈ ${valueInUSD}`}</TokenInputUSD>
      </TokenAdornment>
    );

    const isOverflowing = (value?.toString().length || 0) > 9;

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
        <TokenInputInnerWrapper>
          <TokenInputInput
            ref={inputRef}
            endAdornment={endAdornment}
            isDisabled={isDisabled}
            onChange={chain(handleChange, onChange)}
            value={value}
            minValue={0}
            $isOverflowing={isOverflowing}
            allowFormatting
            {...props}
          />
        </TokenInputInnerWrapper>
      </Stack>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
