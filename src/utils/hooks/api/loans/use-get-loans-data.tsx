import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { displayMonetaryAmount, formatUSD } from '@/common/utils/utils';

import { useGetAccountLoansOverview } from './use-get-account-loans-overview';
import { useGetLoanAssets } from './use-get-loan-assets';

type LoansData = {
  overview: {
    supplyUSDValue: string | undefined;
    borrowUSDValue: string | undefined;
    interestEarnedUSDValue: string | undefined;
    earnedRewardsAmount: string | undefined;
    hasEarnedRewards: boolean;
  };
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  assets: TickerToData<LoanAsset> | undefined;
};

const useGetLoansData = (): LoansData => {
  const {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      totalEarnedInterestUSDValue,
      borrowedAssetsUSDValue,
      earnedRewards
    }
  } = useGetAccountLoansOverview();
  const { assets } = useGetLoanAssets();

  return {
    overview: {
      supplyUSDValue: lentAssetsUSDValue && formatUSD(lentAssetsUSDValue.toNumber()),
      borrowUSDValue: borrowedAssetsUSDValue && formatUSD(borrowedAssetsUSDValue.toNumber()),
      interestEarnedUSDValue: totalEarnedInterestUSDValue && formatUSD(totalEarnedInterestUSDValue.toNumber()),
      earnedRewardsAmount: earnedRewards
        ? `${displayMonetaryAmount(earnedRewards)} ${earnedRewards.currency.ticker}`
        : undefined,
      hasEarnedRewards: !earnedRewards.isZero()
    },
    lendPositions,
    borrowPositions,
    assets
  };
};

export { useGetLoansData };
export type { LoansData };
