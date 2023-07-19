import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { TokenInputProps } from '@/component-library';

const getTokenInputProps = (
  balance?: MonetaryAmount<CurrencyExt>
): Pick<TokenInputProps, 'humanBalance' | 'balance'> => {
  return {
    balance: balance ? balance.toString() : 0,
    humanBalance: balance ? balance.toHuman() : 0
  };
};

export { getTokenInputProps };
