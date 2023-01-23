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

type SingleToken = string;

type MultiToken = { text: string; icons: string[] };

type TokenTicker = SingleToken | MultiToken;

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
  ticker?: TokenTicker;
  defaultTicker?: TokenTicker;
  tokens?: TokenData[];
  onClickBalance?: (balance?: number) => void;
  onChangeTicker?: (ticker?: string) => void;
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
      ticker: tickerProp,
      defaultTicker,
      tokens = [],
      style,
      hidden,
      className,
      onClickBalance,
      onChangeTicker,
      selectProps,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const [tickerValue, setTickerValue] = useState(
      (selectProps?.defaultValue as string) || (typeof defaultTicker === 'string' ? defaultTicker : defaultTicker?.text)
    );

    const { labelProps, fieldProps } = useLabel({ label, ...props });

    useEffect(() => {
      if (tickerProp === undefined) return;

      setTickerValue(typeof tickerProp === 'string' ? tickerProp : tickerProp?.text);
    }, [tickerProp]);

    useEffect(() => {
      if (selectProps?.value === undefined) return;

      setTickerValue(selectProps.value as string);
    }, [selectProps?.value]);

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handleTokenChange = (ticker: string) => {
      onChangeTicker?.(ticker);
      setTickerValue(ticker);
    };

    const customIcons = typeof tickerProp === 'object' ? tickerProp.icons : undefined;

    const isSelectDisabled = !tokens?.length;
    const endAdornment = (
      <TokenSelect
        value={tickerValue}
        icons={customIcons}
        isDisabled={isSelectDisabled}
        tokens={tokens}
        onChange={handleTokenChange}
        // Allows seamingless integration with form lib
        selectProps={selectProps}
      />
    );

    const formatOptions = getFormatOptions(decimals);

    const hasLabel = !!label || balance !== undefined;

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        {hasLabel && (
          <TokenInputLabel
            ticker={tickerValue}
            balance={balance}
            balanceLabel={balanceLabel}
            balanceDecimals={balanceDecimals}
            isDisabled={isDisabled || !tickerValue}
            onClickBalance={handleClickBalance}
            {...labelProps}
          >
            {label}
          </TokenInputLabel>
        )}
        <NumberInput
          ref={inputRef}
          minValue={0}
          size='large'
          isDisabled={isDisabled}
          formatOptions={formatOptions}
          endAdornment={endAdornment}
          bottomAdornment={
            <StyledUSDAdornment $isDisabled={isDisabled}>{formatUSD(valueUSD, { compact: true })}</StyledUSDAdornment>
          }
          {...mergeProps(props, fieldProps)}
        />
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps, TokenTicker };
