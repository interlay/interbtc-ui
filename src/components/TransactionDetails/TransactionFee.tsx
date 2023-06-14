import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { DlGroupProps } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetPrices } from '@/utils/hooks/api/use-get-prices';

import { TransactionDetailsDd } from './TransactionDetailsDd';
import { TransactionDetailsDt } from './TransactionDetailsDt';
import { TransactionDetailsGroup } from './TransactionDetailsGroup';

type Props = {
  label?: ReactNode;
  tooltipLabel?: ReactNode;
  amount: MonetaryAmount<CurrencyExt>;
};

type InheritAttrs = Omit<DlGroupProps, keyof Props>;

type TransactionFeeProps = Props & InheritAttrs;

const TransactionFee = ({ label, tooltipLabel, amount, ...props }: TransactionFeeProps): JSX.Element => {
  const prices = useGetPrices();
  const { t } = useTranslation();

  return (
    <TransactionDetailsGroup {...props}>
      <TransactionDetailsDt tooltipLabel={tooltipLabel}>{label || t('fee')}</TransactionDetailsDt>
      <TransactionDetailsDd>
        {amount.toHuman()} {amount.currency.ticker} (
        {displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd)})
      </TransactionDetailsDd>
    </TransactionDetailsGroup>
  );
};

export { TransactionFee };
export type { TransactionFeeProps };
