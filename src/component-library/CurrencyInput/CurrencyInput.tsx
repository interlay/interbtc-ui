import { useLabel } from '@react-aria/label';
import { mergeProps } from '@react-aria/utils';
import { forwardRef, ReactNode, useEffect, useState } from 'react';

import { Flex } from '../Flex';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { useDOMRef } from '../utils/dom';
import { triggerChangeEvent } from '../utils/input';
import { CurrencyAdornment } from './CurrencyAdornment';
import { StyledUSDAdornment } from './CurrencyInput.style';
import { CurrencyLabel } from './CurrencyLabel';
import { CurrencyData } from './CurrencyList';
import { CurrencyModal } from './CurrencyModal';

const getFormatOptions = (decimals?: number): Intl.NumberFormatOptions | undefined => {
  if (!decimals) return;

  return {
    style: 'decimal',
    maximumFractionDigits: decimals,
    useGrouping: false
  };
};

type Props = {
  decimals?: number;
  valueUSD: string;
  balance?: number;
  balanceLabel?: ReactNode;
  currency: string;
  currencies?: CurrencyData[];
  onClickBalance?: (balance?: number) => void;
  onChangeCurrency?: (token: string) => void;
};

type InheritAttrs = Omit<NumberInputProps, keyof Props>;

type CurrencyInputProps = Props & InheritAttrs;

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      decimals,
      valueUSD,
      balance,
      balanceLabel,
      isDisabled,
      label,
      currency: currencyProp,
      currencies,
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

    const [currency, setCurrency] = useState(currencyProp);
    const [isOpen, setOpen] = useState(false);

    const { labelProps, fieldProps } = useLabel({ label });

    useEffect(() => {
      if (!currencyProp) return;

      setCurrency(currencyProp);
    }, [currencyProp]);

    const handleClickBalance = () => {
      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handlePressToken = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleSelectToken = (currency: string) => {
      setCurrency(currency);
      handleClose();
    };

    const hasSelect = !!onChangeCurrency && currencies?.length;

    const endAdornment = <CurrencyAdornment currency={currency} onPress={hasSelect ? handlePressToken : undefined} />;

    const formatOptions = getFormatOptions(decimals);

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        <CurrencyLabel
          currency={currency}
          balance={balance}
          balanceLabel={balanceLabel}
          decimals={decimals}
          isDisabled={isDisabled}
          onClickBalance={handleClickBalance}
          {...labelProps}
        >
          {label}
        </CurrencyLabel>
        <NumberInput
          ref={inputRef}
          minValue={0}
          size='large'
          isDisabled={isDisabled}
          formatOptions={formatOptions}
          endAdornment={endAdornment}
          endAdornmentSize={hasSelect ? 'extra-large' : 'large'}
          bottomAdornment={<StyledUSDAdornment>{valueUSD}</StyledUSDAdornment>}
          {...mergeProps(props, fieldProps)}
        />
        {hasSelect && (
          <CurrencyModal
            isOpen={isOpen}
            currencies={currencies}
            selectedCurrency={currency}
            onClose={handleClose}
            onSelect={handleSelectToken}
          />
        )}
      </Flex>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
export type { CurrencyInputProps };
