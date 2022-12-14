import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { AlignItems } from '@/component-library';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { MonetaryCell } from './MonetaryCell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices?: Prices;
  alignItems?: AlignItems;
};

const BalanceCell = ({ amount, prices, alignItems }: BalanceCellProps): JSX.Element => {
  const assetBalanceUSD = displayMonetaryAmountInUSDFormat(amount, prices?.[amount.currency.ticker].usd);
  const assetBalance = formatNumber(amount.toBig().toNumber(), {
    maximumFractionDigits: amount.currency.humanDecimals
  });

  return (
    <MonetaryCell alignItems={alignItems} label={assetBalance} sublabel={assetBalanceUSD} labelColor='secondary' />
  );
};

export { BalanceCell };
export type { BalanceCellProps };
