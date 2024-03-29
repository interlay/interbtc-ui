import { AccountId } from '@polkadot/types/interfaces';

import {
  useGetLoanAvailableAmounts,
  UseGetLoanAvailableAmountsResult
} from '@/hooks/api/loans/use-get-loan-available-amounts';

import { StrategyFormType, StrategyType } from '../types';
import { StrategyData } from './use-get-strategies';
import { StrategyPositionData } from './use-get-strategy-position';

type useGetStrategyAvailableAmountsResult = UseGetLoanAvailableAmountsResult;

const useGetStrategyAvailableAmounts = (
  type: StrategyFormType,
  strategy: StrategyData,
  proxyAccount: AccountId | undefined,
  position?: StrategyPositionData
): useGetStrategyAvailableAmountsResult => {
  const loanAvailableAmounts = useGetLoanAvailableAmounts(
    type === StrategyFormType.DEPOSIT ? 'lend' : 'withdraw',
    strategy.loanAsset,
    position?.loanPosition,
    proxyAccount
  );

  switch (strategy.type) {
    case StrategyType.BTC_LOW_RISK: {
      return loanAvailableAmounts;
    }
  }
};

export { useGetStrategyAvailableAmounts };
