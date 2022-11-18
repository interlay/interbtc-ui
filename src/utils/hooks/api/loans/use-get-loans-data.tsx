import { BorrowPosition, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';

import { formatNumber, formatUSD } from '@/common/utils/utils';

import { useGetAccountLoansOverview } from './use-get-account-loans-overview';
import { useGetLoanAssets } from './use-get-loan-assets';

type LoansData = {
  overview: {
    supplyUSDValue: string | undefined;
    borrowUSDValue: string | undefined;
    netYieldUSDValue: string | undefined;
    subsidyRewardsAmount: string | undefined;
    hasSubsidyRewards: boolean;
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
      borrowedAssetsUSDValue,
      subsidyRewards,
      netYieldUSDValue
    }
  } = useGetAccountLoansOverview();
  const { data: assets } = useGetLoanAssets();

  return {
    overview: {
      supplyUSDValue: lentAssetsUSDValue && formatUSD(lentAssetsUSDValue.toNumber()),
      borrowUSDValue: borrowedAssetsUSDValue && formatUSD(borrowedAssetsUSDValue.toNumber()),
      netYieldUSDValue: netYieldUSDValue ? formatUSD(netYieldUSDValue.toNumber()) : formatUSD(0),
      subsidyRewardsAmount: subsidyRewards
        ? `${formatNumber(subsidyRewards.toBig().toNumber(), {
            maximumFractionDigits: subsidyRewards.currency.humanDecimals || 5
          })} ${subsidyRewards.currency.ticker}`
        : formatUSD(0),
      hasSubsidyRewards: !!subsidyRewards && !subsidyRewards?.isZero()
    },
    lendPositions,
    borrowPositions,
    assets
  };
};

export { useGetLoansData };
export type { LoansData };
