import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { displayMonetaryAmountInUSDFormat, formatNumber } from '@/common/utils/utils';
import { Prices } from '@/utils/hooks/api/use-get-prices';

import { MonetaryCell } from './MonetaryCell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  prices?: Prices;
};

const BalanceCell = ({ amount, prices }: BalanceCellProps): JSX.Element => {
  const assetBalanceUSD = displayMonetaryAmountInUSDFormat(amount, prices?.[amount.currency.ticker].usd);
  const assetBalance = formatNumber(amount.toBig().toNumber(), {
    maximumFractionDigits: amount.currency.humanDecimals
  });
  const assetBalanceTicker = amount.currency.ticker;

  return (
    <MonetaryCell
      label={assetBalance}
      labelCurrency={assetBalanceTicker}
      sublabel={assetBalanceUSD}
      labelColor='secondary'
    />
  );
};

export { BalanceCell };
export type { BalanceCellProps };
