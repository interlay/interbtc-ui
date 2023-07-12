import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps, useId } from '@react-aria/utils';
import { ReactNode } from 'react';
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
  amount?: MonetaryAmount<CurrencyExt>;
  label?: ReactNode;
  isValid?: boolean;
  tooltipLabel?: ReactNode;
  selectProps?: TransactionSelectTokenProps;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type TransactionFeeDetailsProps = Props & InheritAttrs;

const TransactionFeeDetails = ({
  amount,
  isValid,
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

  const amountLabel = amount
    ? `${amount.toHuman()} ${amount.currency.ticker} (${displayMonetaryAmountInUSDFormat(
        amount,
        getTokenPrice(prices, amount.currency.ticker)?.usd
      )})`
    : `${0.0} ${selectProps?.value} (${formatUSD(0)})`;

  const errorMessage =
    isValid === false && t('forms.ensure_adequate_amount_left_to_cover_action', { action: t('fees').toLowerCase() });

  return (
    <Flex gap='spacing2' direction='column' className={className}>
      <TransactionDetails {...props}>
        {selectProps && (
          <TransactionSelectToken
            {...mergeProps(selectProps || {}, {
              label: t('fee_token'),
              items: selectCurrency.items
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
