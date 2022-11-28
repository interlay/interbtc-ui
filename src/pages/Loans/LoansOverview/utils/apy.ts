import Big from 'big.js';

import { formatPercentage } from '@/common/utils/utils';

const MIN_DECIMAL_NUMBER = 0.01;

// MEMO: returns formatted apy or better representation of a very small apy
const getApyLabel = (apy: Big): string => {
  const isTinyApy = apy.lt(MIN_DECIMAL_NUMBER);

  return isTinyApy ? `<${MIN_DECIMAL_NUMBER}%` : formatPercentage(apy.toNumber());
};

export { getApyLabel };
