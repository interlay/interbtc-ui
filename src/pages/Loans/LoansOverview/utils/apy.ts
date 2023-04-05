import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

const MIN_DECIMAL_NUMBER = 0.01;

const isTinyApy = (isPositive: boolean, apy: Big) =>
  isPositive ? apy.lt(MIN_DECIMAL_NUMBER) : apy.gt(-MIN_DECIMAL_NUMBER);

// MEMO: returns formatted apy or better representation of a very small apy
const getApyLabel = (apy: Big): string => {
  const isPositive = apy.gt(0);

  if (!apy.eq(0) && isTinyApy(isPositive, apy)) {
    const tinyIndicator = apy.gt(0) ? '<' : '>';
    const minDecimal = isPositive ? MIN_DECIMAL_NUMBER : -MIN_DECIMAL_NUMBER;

    return `${tinyIndicator}${minDecimal}%`;
  }

  return formatPercentage(apy.toNumber());
};

export { getApyLabel };
