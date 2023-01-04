import { useLabel } from '@react-aria/label';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react';

import { formatUSD } from '@/common/utils/utils';

import { Flex } from '../Flex';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { StyledUSDAdornment } from './TokenInput.style';
import { TokenInputLabel } from './TokenInputLabel';
import { TokenData } from './TokenList';
import { TokenSelect } from './TokenSelect';

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
  valueUSD: number;
  balance?: number;
  balanceLabel?: ReactNode;
  balanceDecimals?: number;
  token?: string;
  tokens?: TokenData[];
  onClickBalance?: (balance?: number) => void;
  selectProps?: InputHTMLAttributes<HTMLInputElement>;
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
      selectProps,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const [token, setToken] = useState((selectProps?.value as string) || tokenProp);

    const { labelProps, fieldProps } = useLabel({ label });

    useEffect(() => {
      if (!tokenProp) return;

      setToken(tokenProp);
    }, [tokenProp]);

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handleTokenChange = (token: string) => setToken(token);

    const isSelectDisabled = !selectProps || !tokens?.length;
    const endAdornment = (
      <TokenSelect
        token={token}
        isDisabled={isSelectDisabled}
        tokens={tokens}
        onChange={handleTokenChange}
        // Allows seamingless integration with form lib
        selectProps={selectProps}
      />
    );

    const formatOptions = getFormatOptions(decimals);

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        <TokenInputLabel
          token={token}
          balance={balance}
          balanceLabel={balanceLabel}
          balanceDecimals={balanceDecimals}
          isDisabled={isDisabled || !token}
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
          paddingX={{ right: isSelectDisabled ? 'lg' : token ? 'xl' : 'xl2' }}
          endAdornment={endAdornment}
          bottomAdornment={<StyledUSDAdornment>{formatUSD(valueUSD, { compact: true })}</StyledUSDAdornment>}
          {...mergeProps(props, fieldProps)}
        />
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
