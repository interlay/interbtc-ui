import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { mergeProps } from '@react-aria/utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat, formatUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

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
  tooltipLabel?: ReactNode;
  selectProps?: TransactionSelectTokenProps;
};

type InheritAttrs = Omit<TransactionDetailsProps, keyof Props>;

type TransactionFeeDetailsProps = Props & InheritAttrs;

const TransactionFeeDetails = ({
  amount,
  label,
  tooltipLabel,
  selectProps,
  ...props
}: TransactionFeeDetailsProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  const amountLabel = amount
    ? `${amount.toHuman()} ${amount.currency.ticker} (
    ${displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})`
    : `${0.0} ${selectProps?.value} (${formatUSD(0)})`;

  return (
    <TransactionDetails {...props}>
      {selectProps && <TransactionSelectToken {...mergeProps({ label: t('fee_token') }, selectProps)} />}
      <TransactionDetailsGroup>
        <TransactionDetailsDt tooltipLabel={tooltipLabel}>{label || t('fx_fees')}</TransactionDetailsDt>
        <TransactionDetailsDd>{amountLabel}</TransactionDetailsDd>
      </TransactionDetailsGroup>
    </TransactionDetails>
  );
};

export { TransactionFeeDetails };
export type { TransactionFeeDetailsProps };
