import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { displayMonetaryAmount, formatUSD } from '@/common/utils/utils';
import { Status } from '@/component-library/utils/prop-types';

import { useGetAccountLoansOverview } from './use-get-account-loans-overview';
import { useGetLoanAssets } from './use-get-loan-assets';

type LoansData = {
  overview: {
    supplyUSDValue: string | undefined;
    borrowUSDValue: string | undefined;
    netYieldUSDValue: string | undefined;
    earnedRewardsAmount: string | undefined;
    hasEarnedRewards: boolean;
  };
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  assets: TickerToData<LoanAsset> | undefined;
  thresholds: Record<Status, number>;
};

const useGetLoansData = (): LoansData => {
  const {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      borrowedAssetsUSDValue,
      earnedRewards,
      netYieldUSDValue
    }
  } = useGetAccountLoansOverview();
  const { assets } = useGetLoanAssets();

  return {
    overview: {
      supplyUSDValue: lentAssetsUSDValue && formatUSD(lentAssetsUSDValue.toNumber()),
      borrowUSDValue: borrowedAssetsUSDValue && formatUSD(borrowedAssetsUSDValue.toNumber()),
      netYieldUSDValue: netYieldUSDValue && formatUSD(netYieldUSDValue.toNumber()),
      earnedRewardsAmount: earnedRewards
        ? `${displayMonetaryAmount(earnedRewards)} ${earnedRewards.currency.ticker}`
        : undefined,
      hasEarnedRewards: !!earnedRewards?.isZero()
    },
    lendPositions,
    borrowPositions,
    assets,
    // TODO: get this from the lib
    thresholds: {
      error: 1,
      warning: 2,
      success: 10
    }
  };
};

export { useGetLoansData };
export type { LoansData };
