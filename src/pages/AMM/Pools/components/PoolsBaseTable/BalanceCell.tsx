import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { formatUSD } from '@/common/utils/utils';
import { AlignItems } from '@/component-library';

import { MonetaryCell } from './MonetaryCell';

type BalanceCellProps = {
  amount: MonetaryAmount<CurrencyExt>;
  amountUSD: number;
  alignItems?: AlignItems;
};

const BalanceCell = ({ amount, amountUSD, alignItems }: BalanceCellProps): JSX.Element => (
  <MonetaryCell
    alignItems={alignItems}
    label={amount.toString()}
    sublabel={formatUSD(amountUSD, { compact: true })}
    labelColor='secondary'
  />
);

export { BalanceCell };
export type { BalanceCellProps };
