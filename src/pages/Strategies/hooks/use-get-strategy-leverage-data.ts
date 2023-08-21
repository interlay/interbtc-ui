import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { StrategyData } from './use-get-strategies';

type UseGetStrategyLeverageData = {
  leverage: Big;
  liquidity: MonetaryAmount<CurrencyExt>;
  collateralInput: MonetaryAmount<CurrencyExt>;
  price: {
    entry: Big;
    liquidation: Big;
  };
  ltv: Big;
  apy: Big;
};

const useGetStrategyLeverageData = (
  strategy: StrategyData,
  depositAmount: MonetaryAmount<CurrencyExt>,
  leverage: number
): UseGetStrategyLeverageData => {
  return {
    apy: Big(10),
    collateralInput: depositAmount,
    leverage: new Big(leverage),
    ltv: new Big(0),
    liquidity: strategy.loanAsset.availableCapacity,
    price: {
      entry: new Big(0),
      liquidation: new Big(0)
    }
  };
};

export { useGetStrategyLeverageData };
export type { UseGetStrategyLeverageData };
