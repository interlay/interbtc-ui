import { useLabel } from '@react-aria/label';
import { chain, mergeProps, useId } from '@react-aria/utils';
import { forwardRef, Key, ReactNode, useEffect, useState } from 'react';

import { Flex } from '../Flex';
import { HelperText } from '../HelperText';
import { NumberInput, NumberInputProps } from '../NumberInput';
import { useDOMRef } from '../utils/dom';
import { formatUSD } from '../utils/format';
import { triggerChangeEvent } from '../utils/input';
import { TokenAdornment, TokenTicker } from './TokenAdornment';
import { StyledUSDAdornment } from './TokenInput.style';
import { TokenInputLabel } from './TokenInputLabel';
import { TokenSelect, TokenSelectProps } from './TokenSelect';

type Props = {
  valueUSD?: number;
  balance?: string | number;
  humanBalance?: string | number;
  balanceLabel?: ReactNode;
  ticker?: TokenTicker;
  onClickBalance?: (balance?: string | number) => void;
  onChangeTicker?: (ticker?: string) => void;
  selectProps?: Omit<TokenSelectProps, 'label' | 'helperTextId'>;
};

type InheritAttrs = Omit<NumberInputProps, keyof Props>;

type TokenInputProps = Props & InheritAttrs;

const TokenInput = forwardRef<HTMLInputElement, TokenInputProps>(
  (
    {
      valueUSD,
      balance,
      humanBalance,
      balanceLabel,
      isDisabled,
      label,
      ticker: tickerProp,
      style,
      hidden,
      className,
      onClickBalance,
      onChangeTicker,
      selectProps,
      placeholder = '0',
      errorMessage,
      description,
      ...props
    },
    ref
  ): JSX.Element => {
    const inputRef = useDOMRef(ref);

    const [ticker, setTicker] = useState<string>(
      (selectProps?.defaultValue as string) || (typeof tickerProp === 'string' ? tickerProp : tickerProp?.text) || ''
    );

    const { labelProps, fieldProps } = useLabel({ label, ...props });

    const selectHelperTextId = useId();

    const itemsArr = Array.from(selectProps?.items || []);
    const isSelectAdornment = itemsArr.length > 1;
    const adornmentTicker = !isSelectAdornment && selectProps?.items ? itemsArr[0]?.value : tickerProp;

    useEffect(() => {
      if (selectProps?.value === undefined) return;

      setTicker(selectProps.value as string);
    }, [selectProps?.value]);

    const handleClickBalance = () => {
      if (!balance) return;

      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handleTokenChange = (ticker: Key) => {
      onChangeTicker?.(ticker as string);
      setTicker(ticker as string);
    };

    // Prioritise Number Input description and error message
    const hasSelectHelperText =
      !errorMessage && !description && (selectProps?.errorMessage || selectProps?.description);
    const { onSelectionChange, ...restSelectProps } = selectProps || {};

    const endAdornment = isSelectAdornment ? (
      <TokenSelect
        {...restSelectProps}
        value={ticker}
        onSelectionChange={chain(onSelectionChange, handleTokenChange)}
        label={label}
        aria-label={fieldProps['aria-label']}
        aria-describedby={hasSelectHelperText ? selectHelperTextId : undefined}
        validationState={hasSelectHelperText ? 'invalid' : undefined}
        errorMessage={undefined}
      />
    ) : adornmentTicker ? (
      <TokenAdornment ticker={adornmentTicker} />
    ) : null;

    const hasLabel = !!label || balance !== undefined;

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        {hasLabel && (
          <TokenInputLabel
            ticker={ticker}
            balance={humanBalance || balance}
            balanceLabel={balanceLabel}
            isDisabled={isDisabled || !ticker}
            onClickBalance={handleClickBalance}
            {...labelProps}
          >
            {label}
          </TokenInputLabel>
        )}
        <NumberInput
          ref={inputRef}
          placeholder={placeholder}
          size='large'
          isDisabled={isDisabled}
          endAdornment={endAdornment}
          bottomAdornment={
            valueUSD !== undefined && (
              <StyledUSDAdornment $isDisabled={isDisabled}>{formatUSD(valueUSD, { compact: true })}</StyledUSDAdornment>
            )
          }
          errorMessage={errorMessage}
          description={description}
          {...mergeProps(props, fieldProps)}
        />
        {hasSelectHelperText && (
          <HelperText
            id={selectHelperTextId}
            errorMessage={selectProps?.errorMessage}
            description={selectProps?.description}
          />
        )}
      </Flex>
    );
  }
);

TokenInput.displayName = 'TokenInput';

export { TokenInput };
export type { TokenInputProps };
