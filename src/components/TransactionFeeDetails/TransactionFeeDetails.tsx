import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps, useId } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { Key, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { Alert, Input, InputProps } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { useSelectCurrency } from '@/utils/hooks/use-select-currency';

import {
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionDetailsProps,
  TransactionSelectToken,
  TransactionSelectTokenProps
} from '../TransactionDetails';

type Props = {
  currency?: CurrencyExt;
  amount?: MonetaryAmount<CurrencyExt>;
  availableBalance?: MonetaryAmount<CurrencyExt>;
  label?: ReactNode;
  onSelectionChange?: (key: Key) => void;
  tooltipLabel?: ReactNode;
  hiddenInputProps?: InputProps;
  selectProps?: TransactionSelectTokenProps;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type TransactionFeeDetailsProps = Props & InheritAttrs;

const TransactionFeeDetails = ({
  amount,
  currency,
  onSelectionChange,
  selectProps,
  label,
  tooltipLabel,
  hiddenInputProps,
  ...props
}: TransactionFeeDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();
  const id = useId();

  // TEMP
  const selectCurrency = useSelectCurrency();

  const amountLabel = amount
    ? `${amount.toHuman()} ${amount.currency.ticker} (${displayMonetaryAmountInUSDFormat(
        amount,
        getTokenPrice(prices, amount.currency.ticker)?.usd
      )})`
    : `${0.0} ${currency?.ticker} (${formatUSD(0)})`;

  const { errorMessage } = hiddenInputProps || {};

  const selectTokenProps = mergeProps(
    { onSelectionChange, label: t('fee_token'), items: selectCurrency.items, value: currency?.ticker },
    selectProps || {}
  );

  return (
    <>
      <TransactionDetails {...props}>
        {(onSelectionChange || selectProps) && (
          <TransactionSelectToken
            aria-describedby={errorMessage ? id : undefined}
            validationState={errorMessage ? 'invalid' : 'valid'}
            {...selectTokenProps}
          />
        )}
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel={tooltipLabel}>{label || t('fx_fees')}</TransactionDetailsDt>
          <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
          {hiddenInputProps && (
            <VisuallyHidden>
              <Input aria-hidden {...hiddenInputProps} />
            </VisuallyHidden>
          )}
        </TransactionDetailsGroup>
      </TransactionDetails>
      {errorMessage && (
        <Alert id={id} status='error'>
          {errorMessage}
        </Alert>
      )}
    </>
  );
};

export { TransactionFeeDetails };
export type { TransactionFeeDetailsProps };
