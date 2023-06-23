import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps, useId } from '@react-aria/utils';
import { Key, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { Alert, Flex } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';
import { SelectCurrencyFilter, useSelectCurrency } from '@/utils/hooks/use-select-currency';

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
  defaultCurrency?: CurrencyExt;
  amount?: MonetaryAmount<CurrencyExt>;
  label?: ReactNode;
  showInsufficientBalance?: boolean;
  tooltipLabel?: ReactNode;
  selectProps?: TransactionSelectTokenProps;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type TransactionFeeDetailsProps = Props & InheritAttrs;

const TransactionFeeDetails = ({
  amount,
  defaultCurrency,
  showInsufficientBalance,
  selectProps,
  label,
  tooltipLabel,
  className,
  ...props
}: TransactionFeeDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();
  const selectCurrency = useSelectCurrency(SelectCurrencyFilter.TRADEABLE_FOR_NATIVE_CURRENCY);
  const id = useId();
  const [ticker, setTicker] = useState(defaultCurrency?.ticker);

  const amountLabel = amount
    ? `${amount.toHuman()} ${amount.currency.ticker} (${displayMonetaryAmountInUSDFormat(
        amount,
        getTokenPrice(prices, amount.currency.ticker)?.usd
      )})`
    : `${0.0} ${ticker} (${formatUSD(0)})`;

  const errorMessage = showInsufficientBalance && t('forms.ensure_adequate_amount_left_to_cover_fees');

  const handleSelectionChange = (key: Key) => setTicker(key as string);

  return (
    <Flex gap='spacing2' direction='column' className={className}>
      <TransactionDetails {...props}>
        {selectProps && (
          <TransactionSelectToken
            {...mergeProps(selectProps || {}, {
              label: t('fee_token'),
              items: selectCurrency.items,
              value: ticker,
              onSelectionChange: handleSelectionChange
            })}
            errorMessage={undefined}
            aria-describedby={errorMessage ? id : undefined}
            validationState={errorMessage ? 'invalid' : 'valid'}
          />
        )}
        <TransactionDetailsGroup>
          <TransactionDetailsDt tooltipLabel={tooltipLabel}>{label || t('tx_fees')}</TransactionDetailsDt>
          <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
        </TransactionDetailsGroup>
      </TransactionDetails>
      {errorMessage && (
        <Alert id={id} status='error'>
          {errorMessage}
        </Alert>
      )}
    </Flex>
  );
};

export { TransactionFeeDetails };
export type { TransactionFeeDetailsProps };
