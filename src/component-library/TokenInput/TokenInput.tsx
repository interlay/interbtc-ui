import { useLabel } from '@react-aria/label';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, ReactNode, useState } from 'react';

import { Flex } from '../Flex';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { TokenAdornment } from './TokenAdornment';
import { StyledUSDAdornment } from './TokenInput.style';
import { TokenLabel } from './TokenLabel';
import { CurrencyItem, TokenModal } from './TokenModal';

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
  onSelectToken?: (token: string) => void;
  currencies?: CurrencyItem[];
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
      label,
      onClickBalance,
      onSelectToken,
      currencies,
      ...props
    },
    ref
  ): JSX.Element => {
    const [isOpen, setOpen] = useState(false);
    const inputRef = useDOMRef(ref);
    const { labelProps, fieldProps } = useLabel({ label });

    const isTokenDynamic = !!onSelectToken && currencies?.length;

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handlePressToken = () => {
      setOpen(true);
    };

    const endAdornment = <TokenAdornment currency={tokenSymbol} onPress={handlePressToken} />;

    const formatOptions = getFormatOptions(decimals);

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        <TokenLabel
          currency={tokenSymbol}
          balance={balance}
          balanceLabel={balanceLabel}
          decimals={decimals}
          isDisabled={isDisabled}
          onClickBalance={handleClickBalance}
          {...labelProps}
        >
          {label}
        </TokenLabel>
        <NumberInput
          ref={inputRef}
          minValue={0}
          size='large'
          isDisabled={isDisabled}
          formatOptions={formatOptions}
          endAdornment={endAdornment}
          endAdornmentSize={isTokenDynamic ? 'extra-large' : 'large'}
          bottomAdornment={<StyledUSDAdornment>{valueInUSD}</StyledUSDAdornment>}
          {...mergeProps(props, fieldProps)}
        />
        {isTokenDynamic && <TokenModal open={isOpen} onClose={() => setOpen(false)} currencies={currencies} />}
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
