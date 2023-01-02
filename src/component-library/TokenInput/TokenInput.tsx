import { useLabel } from '@react-aria/label';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, ReactNode, useEffect, useState } from 'react';

import { Flex } from '../Flex';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { StyledUSDAdornment } from './TokenInput.style';
import { TokenInputAdornment } from './TokenInputAdornment';
import { TokenInputLabel } from './TokenInputLabel';
import { TokenData } from './TokenList';
import { TokenListModal } from './TokenListModal';

const getFormatOptions = (decimals?: number): Intl.NumberFormatOptions | undefined => {
  if (!decimals) return;

  return {
    style: 'decimal',
    maximumFractionDigits: decimals || 20,
    useGrouping: false
  };
};

type Props = {
  decimals?: number;
  valueUSD: string;
  balance?: number;
  balanceLabel?: ReactNode;
  balanceDecimals?: number;
  token?: string;
  tokens?: TokenData[];
  onClickBalance?: (balance?: number) => void;
  onChangeCurrency?: (token: string) => void;
};

type InheritAttrs = Omit<NumberInputProps, keyof Props>;

type TokenInputProps = Props & InheritAttrs;

const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  (
    {
      decimals,
      valueUSD,
      balance,
      balanceLabel,
      balanceDecimals,
      isDisabled,
      label,
      token: tokenProp,
      tokens = [],
      style,
      hidden,
      className,
      onClickBalance,
      onChangeCurrency,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const [token, setCurrency] = useState(tokenProp);
    const [isOpen, setOpen] = useState(false);

    const { labelProps, fieldProps } = useLabel({ label });

    useEffect(() => {
      if (!tokenProp) return;

      setCurrency(tokenProp);
    }, [tokenProp]);

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handlePressToken = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleSelectToken = (token: string) => {
      setCurrency(token);
      handleClose();
    };

    const hasSelect = !!onChangeCurrency && tokens?.length;

    const endAdornment = <TokenInputAdornment token={token} onPress={hasSelect ? handlePressToken : undefined} />;

    const formatOptions = getFormatOptions(decimals);

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        <TokenInputLabel
          token={token}
          balance={balance}
          balanceLabel={balanceLabel}
          balanceDecimals={balanceDecimals}
          isDisabled={isDisabled}
          onClickBalance={handleClickBalance}
          {...labelProps}
        >
          {label}
        </TokenInputLabel>
        <NumberInput
          ref={inputRef}
          minValue={0}
          size='large'
          isDisabled={isDisabled}
          formatOptions={formatOptions}
          endAdornment={endAdornment}
          endAdornmentSize={hasSelect ? (token ? 'x-large' : '2x-large') : 'large'}
          bottomAdornment={<StyledUSDAdornment>{valueUSD}</StyledUSDAdornment>}
          {...mergeProps(props, fieldProps)}
        />
        {hasSelect && (
          <TokenListModal
            isOpen={isOpen}
            tokens={tokens}
            selectedToken={token}
            onClose={handleClose}
            onSelect={handleSelectToken}
          />
        )}
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
