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

    const [selectValue, setSelectValue] = useState((selectProps?.defaultValue as string) || '');

    const { labelProps, fieldProps } = useLabel({ label, ...props });

    const selectHelperTextId = useId();

    const firstItemInSelectProps =
      selectProps?.items && Object.keys(selectProps.items).length === 1 ? Object.values(selectProps.items)[0] : null;

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
    const { onSelectionChange, ...restSelectProps } = selectProps || {};

    const endAdornment = ticker ? (
      <TokenAdornment ticker={ticker} />
    ) : firstItemInSelectProps ? (
      <TokenAdornment ticker={firstItemInSelectProps.value} />
    ) : selectProps ? (
      <TokenSelect
        {...restSelectProps}
        value={selectValue}
        onSelectionChange={chain(onSelectionChange, handleTokenChange)}
        label={label}
        aria-label={fieldProps['aria-label']}
        aria-describedby={hasSelectHelperText ? selectHelperTextId : undefined}
        validationState={hasSelectHelperText ? 'invalid' : undefined}
        errorMessage={undefined}
      />
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
