import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { Key, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
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
  label?: ReactNode;
  onSelectionChange?: (key: Key) => void;
  selectProps?: TransactionSelectTokenProps;
  tooltipLabel?: ReactNode;
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
  ...props
}: TransactionFeeDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  // TEMP
  const selectCurrency = useSelectCurrency();

  const amountLabel = amount
    ? `${amount.toHuman()} ${amount.currency.ticker} (
    ${displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})`
    : `${0.0} ${currency?.ticker} (${formatUSD(0)})`;

  return (
    <TransactionDetails {...props}>
      {(onSelectionChange || selectProps) && (
        <TransactionSelectToken
          {...mergeProps(
            { onSelectionChange, label: t('fee_token'), items: selectCurrency.items, value: currency?.ticker },
            selectProps || {}
          )}
        />
      )}
      <TransactionDetailsGroup>
        <TransactionDetailsDt tooltipLabel={tooltipLabel}>{label || t('fx_fees')}</TransactionDetailsDt>
        <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { TransactionFeeDetails };
export type { TransactionFeeDetailsProps };
