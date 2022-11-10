import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

import { MonetaryCell } from './MonetaryCell';

type ApyCellProps = {
  apy: Big;
  amount?: string;
};

const ApyCell = ({ apy, amount }: ApyCellProps): JSX.Element => {
  const apyPercentage = formatPercentage(apy.toNumber());

  return <MonetaryCell label={apyPercentage} sublabel={amount} />;
};

export { ApyCell };
export type { ApyCellProps };
