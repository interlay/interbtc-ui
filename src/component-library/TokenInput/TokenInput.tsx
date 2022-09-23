import { chain } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, ReactNode, useEffect, useState } from 'react';

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
  balance?: number;
  balanceInUSD?: string | number;
  renderBalance?: (balance: number) => ReactNode;
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
      renderBalance,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const [value, setValue] = useState<number | undefined>(valueProp);

    const handleClickBalance = () => triggerChangeEvent(inputRef, balance);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const value = e.target.value;

      if (!value) {
        return setValue(undefined);
      }

      setValue(Number(value));
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

    // TODO: how do we handle this with different sized/resized inputs
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
            renderBalance={renderBalance}
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
