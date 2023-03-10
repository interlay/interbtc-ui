import { useLabel } from '@react-aria/label';
import { mergeProps, useId } from '@react-aria/utils';
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
      ticker,
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

    const [selectValue, setSelectValue] = useState(selectProps?.defaultValue as string);

    const { labelProps, fieldProps } = useLabel({ label, ...props });

    const selectHelperTextId = useId();

    useEffect(() => {
      if (selectProps?.value === undefined) return;

      setSelectValue(selectProps.value as string);
    }, [selectProps?.value]);

    const handleClickBalance = () => {
      if (!balance) return;

      triggerChangeEvent(inputRef, balance);
      onClickBalance?.(balance);
    };

    const handleTokenChange = (ticker: Key) => {
      onChangeTicker?.(ticker as string);
      setSelectValue(ticker as string);
    };

    // Prioritise Number Input description and error message
    const hasSelectHelperText =
      !errorMessage && !description && (selectProps?.errorMessage || selectProps?.description);
    const { errorMessage: selectErrorProps, ...restSelectProps } = selectProps || {};

    const endAdornment = restSelectProps ? (
      <TokenSelect
        {...restSelectProps}
        value={selectValue}
        onSelectionChange={handleTokenChange}
        label={label}
        aria-label={fieldProps['aria-label']}
        aria-describedby={hasSelectHelperText ? selectHelperTextId : undefined}
        // Only show Select errorMessage when Select HelperText is rendered
        errorMessage={hasSelectHelperText ? selectErrorProps : undefined}
      />
    ) : ticker ? (
      <TokenAdornment ticker={ticker} />
    ) : null;

    const hasLabel = !!label || balance !== undefined;

    return (
      <Flex direction='column' gap='spacing0' className={className} style={style} hidden={hidden}>
        {hasLabel && (
          <TokenInputLabel
            ticker={selectValue}
            balance={humanBalance || balance}
            balanceLabel={balanceLabel}
            isDisabled={isDisabled || !selectValue}
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
