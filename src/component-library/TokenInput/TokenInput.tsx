import { chain } from '@react-aria/utils';
import { ChangeEventHandler, forwardRef, ReactNode, useCallback, useEffect, useState } from 'react';

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
    const [resize, setResize] = useState({ state: false, position: 0 });

    const handleClickBalance = () => triggerChangeEvent(inputRef, balance);

    // Sets input to resize at a certain condition
    const handleOverflow = useCallback(
      (element: HTMLInputElement) => {
        // Condition is true when input text overflows available width
        if (!resize.state && element.clientWidth < element.scrollWidth) {
          return setResize({ state: true, position: element.value.length });
        }

        // Checks if was are back at the position when resize happened.
        if (resize.state && element.value.length < resize.position) {
          return setResize({ state: false, position: 0 });
        }
      },
      [resize.position, resize.state]
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      handleOverflow(e.target);

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

    useEffect(() => {
      if (inputRef.current) {
        handleOverflow(inputRef.current);
      }
    }, [handleOverflow, inputRef]);

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
            overflow={false}
            resize={resize.state}
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
