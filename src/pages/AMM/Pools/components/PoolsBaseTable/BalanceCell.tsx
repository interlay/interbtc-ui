import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { formatNumber, formatUSD } from '@/common/utils/utils';
import { AlignItems } from '@/component-library';

import { MonetaryCell } from './MonetaryCell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  amountUSD: number;
  alignItems?: AlignItems;
};

const BalanceCell = ({ amount, amountUSD, alignItems }: BalanceCellProps): JSX.Element => {
  const assetBalance = formatNumber(amount.toBig().toNumber(), {
    // TODO: figure how many decimals to show
    maximumFractionDigits: amount.currency.humanDecimals || 8
  });

  return (
    <MonetaryCell alignItems={alignItems} label={assetBalance} sublabel={formatUSD(amountUSD)} labelColor='secondary' />
  );
};

export { BalanceCell };
export type { BalanceCellProps };
