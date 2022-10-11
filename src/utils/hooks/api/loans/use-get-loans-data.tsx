import { newAccountId, TickerToData } from '@interlay/interbtc-api';
import { BorrowPosition, LendPosition, LoanAsset } from '@interlay/interbtc-api';

import { formatPercentage, formatUSD } from '@/common/utils/utils';
import { useSubstrateSecureState } from '@/lib/substrate';

import { useGetAccountLoansOverview } from './use-get-account-loans-overview';
import { useGetLoanAssets } from './use-get-loan-assets';

type LoansData = {
  overview: {
    supplyUSDValue: string | undefined;
    borrowUSDValue: string | undefined;
    interestEarnedUSDValue: string | undefined;
    collateralRatio: string | undefined;
    loanStatus: string | undefined;
  };
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  assets: TickerToData<LoanAsset> | undefined;
};

const useGetLoansData = (): LoansData => {
  const { selectedAccount } = useSubstrateSecureState();

  const accountId = selectedAccount && newAccountId(window.bridge.api, selectedAccount.address);

  const {
    lendPositions,
    borrowPositions,
    lentAssetsUSDValue,
    totalEarnedInterestUSDValue,
    borrowedAssetsUSDValue,
    collateralRatio
  } = useGetAccountLoansOverview(accountId);
  const { assets } = useGetLoanAssets();

  return {
    overview: {
      supplyUSDValue: lentAssetsUSDValue && formatUSD(lentAssetsUSDValue.toNumber()),
      borrowUSDValue: borrowedAssetsUSDValue && formatUSD(borrowedAssetsUSDValue.toNumber()),
      interestEarnedUSDValue: totalEarnedInterestUSDValue && formatUSD(totalEarnedInterestUSDValue.toNumber()),
      collateralRatio: collateralRatio && formatPercentage(collateralRatio.toNumber()),
      loanStatus: 'Safe' // TODO: decide loan status thresholds
    },
    lendPositions,
    borrowPositions,
    assets
  };
};

export { useGetLoansData };
export type { LoansData };
