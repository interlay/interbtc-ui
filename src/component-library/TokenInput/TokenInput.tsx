import { chain } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, ReactNode, useEffect, useState } from 'react';

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
    const [overflow, setOverflow] = useState({ state: false, position: 0 });

    const handleClickBalance = () => triggerChangeEvent(inputRef, balance);

    const handleOverflow: ChangeEventHandler<HTMLInputElement> = (e) => {
      const el = e.target as HTMLInputElement;

      if (!overflow.state && el.clientWidth < el.scrollWidth) {
        return setOverflow({ state: true, position: el.value.length });
      }

      if (overflow.state && el.value.length < overflow.position) {
        return setOverflow({ state: false, position: 0 });
      }
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      handleOverflow(e);

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
          <NumberInput
            ref={inputRef}
            endAdornment={endAdornment}
            isDisabled={isDisabled}
            onChange={chain(handleChange, onChange)}
            value={value}
            minValue={0}
            size='large'
            {...props}
            fontResize
            overflow={overflow.state}
          />
        </TokenInputInnerWrapper>
      </Stack>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
