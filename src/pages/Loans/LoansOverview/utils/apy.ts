import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

const MIN_DECIMAL_NUMBER = 0.01;

// MEMO: make apy negative when borrowing
const getLoanApy = (apy: Big, isBorrow: boolean): Big => (isBorrow ? apy.mul(-1) : apy);

// MEMO: returns formatted apy or better representation of a very small apy
const getApyLabel = (apy: Big): string => {
  const isNegative = apy.lt(0);

  const isTinyApy = isNegative ? apy.mul(-1).lt(MIN_DECIMAL_NUMBER) : apy.lt(MIN_DECIMAL_NUMBER);

  if (isTinyApy) {
    return isNegative ? `>-${MIN_DECIMAL_NUMBER}%` : `<${MIN_DECIMAL_NUMBER}%`;
  }

  return formatPercentage(apy.toNumber());
};

export { getApyLabel, getLoanApy };
