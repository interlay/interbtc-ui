import { CurrencyExt, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import {
  STRATEGY_DEPOSIT_AMOUNT_FIELD,
  STRATEGY_WITHDRAW_AMOUNT_FIELD,
  StrategyDepositFormData,
  StrategyWithdrawFormData
} from '@/lib/form';

import { StrategyFormType } from '../types';
import { StrategyData } from './use-get-strategies';
import { StrategyPositionData } from './use-get-strategy-position';

type UseGetStrategyLeverageDataResult = {
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

const useGetStrategyLeverageData = <T extends StrategyFormType>(
  type: T,
  strategy: StrategyData,
  form: T extends StrategyFormType.DEPOSIT ? StrategyDepositFormData : StrategyWithdrawFormData,
  position?: StrategyPositionData
): UseGetStrategyLeverageDataResult => {
  const data = {
    apy: Big(10),
    leverage: new Big(3),
    ltv: new Big(0),
    liquidity: strategy.loanAsset.availableCapacity,
    price: {
      entry: new Big(0),
      liquidation: new Big(0)
    }
  };

  if (type === StrategyFormType.DEPOSIT) {
    const { [STRATEGY_DEPOSIT_AMOUNT_FIELD]: inputAmount } = form as StrategyDepositFormData;
    const inputMonetaryAmount = newMonetaryAmount(inputAmount || 0, strategy.currencies.primary, true);

    const collateralInput = position?.amount ? inputMonetaryAmount.add(position.amount) : inputMonetaryAmount;

    return {
      ...data,
      collateralInput
    };
  }

  const { [STRATEGY_WITHDRAW_AMOUNT_FIELD]: inputAmount } = form as StrategyWithdrawFormData;
  const inputMonetaryAmount = newMonetaryAmount(inputAmount || 0, strategy.currencies.primary, true);

  const collateralInput = position?.amount ? inputMonetaryAmount.sub(inputMonetaryAmount) : inputMonetaryAmount;

  return {
    ...data,
    collateralInput
  };
};

export { useGetStrategyLeverageData };
export type { UseGetStrategyLeverageDataResult };
