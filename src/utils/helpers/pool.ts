import { CurrencyExt, PooledCurrencies } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { Prices } from '@/hooks/api/use-get-prices';
import { getTokenPrice } from '@/utils/helpers/prices';

const calculateTotalLiquidityUSD = (pooledCurrencies: PooledCurrencies, prices?: Prices): number =>
  pooledCurrencies.reduce((total, currentAmount) => {
    const currentAmountUSD = convertMonetaryAmountToValueInUSD(
      currentAmount,
      getTokenPrice(prices, currentAmount.currency.ticker)?.usd
    );
    return total + (currentAmountUSD || 0);
  }, 0);

const calculateAccountLiquidityUSD = (
  lpTokenAmount: MonetaryAmount<CurrencyExt>,
  totalLiquidityUSD: number,
  totalSupply: MonetaryAmount<CurrencyExt>
): number => lpTokenAmount.mul(totalLiquidityUSD).div(totalSupply.toBig()).toBig().toNumber();

export { calculateAccountLiquidityUSD, calculateTotalLiquidityUSD };
