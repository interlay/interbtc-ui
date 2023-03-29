import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { formatUSD } from '@/common/utils/utils';
import { AlignItems } from '@/component-library';

import { Cell } from './Cell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  amountUSD: number;
  alignItems?: AlignItems;
};

const BalanceCell = ({ amount, amountUSD, alignItems }: BalanceCellProps): JSX.Element => (
  <Cell alignItems={alignItems} label={amount.toString()} sublabel={formatUSD(amountUSD, { compact: true })} />
);

export { BalanceCell };
export type { BalanceCellProps };
