import { useButton } from '@react-aria/button';
import { useLabel } from '@react-aria/label';
import { mergeProps } from '@react-aria/utils';
import { PressEvent } from '@react-types/shared';
import { forwardRef, ReactNode, useRef } from 'react';

import { Flex } from '../Flex';
import { Label } from '../Label';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { Tokens } from '../types';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { TokenBalance } from './TokenBalance';
import {
  StyledChevronDown,
  StyledCoinIcon,
  StyledTicker,
  StyledTokenAdornment,
  StyledUSDAdornment
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
  balanceLabel?: ReactNode;
  renderBalance?: (balance: number) => ReactNode;
  onClickBalance?: (balance?: number) => void;
  onPressToken?: (e: PressEvent) => void;
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
      balanceLabel,
      isDisabled,
      className,
      style,
      hidden,
      renderBalance,
      label,
      onClickBalance,
      onPressToken,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);
    const tokenButtonRef = useRef<HTMLDivElement>(null);
    const { labelProps, fieldProps } = useLabel({ label });

    const isTokenClickable = !!onPressToken;
    const { buttonProps } = useButton(
      {
        onPress: onPressToken,
        elementType: 'div',
        isDisabled: !isTokenClickable
      },
      tokenButtonRef
    );

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const endAdornment = (
      <StyledTokenAdornment
        {...(onPressToken && buttonProps)}
        ref={tokenButtonRef}
        alignItems='center'
        justifyContent='center'
        gap='spacing1'
        $isClickable={isTokenClickable}
      >
        <StyledCoinIcon size='inherit' coin={tokenSymbol as Tokens} />
        <StyledTicker>{tokenSymbol}</StyledTicker>
        {isTokenClickable && <StyledChevronDown />}
      </StyledTokenAdornment>
    );

    const formatOptions = getFormatOptions(decimals);

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        <Flex gap='spacing0' justifyContent='space-between'>
          <Label {...labelProps}>{label}</Label>
          {balance !== undefined && (
            <TokenBalance
              tokenSymbol={tokenSymbol}
              value={balance}
              onClickBalance={handleClickBalance}
              isDisabled={isDisabled}
              renderBalance={renderBalance}
              label={balanceLabel}
            />
          )}
        </Flex>
        <NumberInput
          ref={inputRef}
          endAdornment={endAdornment}
          endAdornmentSize={isTokenClickable ? 'extra-large' : 'large'}
          bottomAdornment={<StyledUSDAdornment>{valueInUSD}</StyledUSDAdornment>}
          isDisabled={isDisabled}
          minValue={0}
          size='large'
          formatOptions={formatOptions}
          {...mergeProps(props, fieldProps)}
        />
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
