import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat } from '@/common/utils/utils';
import { AlignItems } from '@/component-library';
import { getTokenPrice } from '@/utils/helpers/prices';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { MonetaryCell } from './MonetaryCell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices?: Prices;
  alignItems?: AlignItems;
};

const BalanceCell = ({ amount, prices, alignItems }: BalanceCellProps): JSX.Element => {
  const assetBalanceUSD = displayMonetaryAmountInUSDFormat(amount, getTokenPrice(prices, amount.currency.ticker)?.usd);

  return (
    <MonetaryCell alignItems={alignItems} label={amount.toHuman()} sublabel={assetBalanceUSD} labelColor='secondary' />
  );
};

export { BalanceCell };
export type { BalanceCellProps };
