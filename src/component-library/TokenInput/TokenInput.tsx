import { forwardRef, ReactNode } from 'react';

import { NumberInput, NumberInputProps } from '../NumberInput';
import { Stack } from '../Stack';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import {
  StyledTokenBalance,
  TokenAdornment,
  TokenInputInnerWrapper,
  TokenInputSymbol,
  TokenInputUSD
} from './TokenInput.style';

const getFormatOptions = (decimals?: number): Intl.NumberFormatOptions | undefined => {
  if (!decimals) return;

  return {
    style: 'decimal',
    maximumFractionDigits: decimals,
    useGrouping: false
  };
};

type Props = {
  tokenSymbol: string;
  decimals?: number;
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
      decimals,
      valueInUSD,
      balance,
      balanceInUSD,
      isDisabled,
      className,
      style,
      hidden,
      renderBalance,
      label,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const handleClickBalance = () => triggerChangeEvent(inputRef, balance);

    const endAdornment = (
      <TokenAdornment>
        <TokenInputSymbol>{tokenSymbol}</TokenInputSymbol>
        <TokenInputUSD>{`≈ ${valueInUSD}`}</TokenInputUSD>
      </TokenAdornment>
    );

    const formatOptions = getFormatOptions(decimals);

    const hasBalance = balance !== undefined && balanceInUSD !== undefined;

    return (
      <Stack spacing='half' className={className} style={style} hidden={hidden}>
        {balance !== undefined && balanceInUSD !== undefined && (
          <StyledTokenBalance
            tokenSymbol={tokenSymbol}
            value={balance}
            valueInUSD={balanceInUSD}
            onClickBalance={handleClickBalance}
            isDisabled={isDisabled}
            renderBalance={renderBalance}
            label={label}
          />
        )}
        <TokenInputInnerWrapper>
          <NumberInput
            ref={inputRef}
            endAdornment={endAdornment}
            isDisabled={isDisabled}
            minValue={0}
            size='large'
            overflow={false}
            formatOptions={formatOptions}
            label={!hasBalance && label}
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
