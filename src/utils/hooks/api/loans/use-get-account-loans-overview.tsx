import { BorrowPosition, CurrencyExt, LendPosition } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { useGetPrices } from '../use-get-prices';
import { useGetAccountPositions } from './use-get-account-positions';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD } from './utils';

interface AccountLoansOverviewData {
  lendPositions: LendPosition[] | undefined;
  borrowPositions: BorrowPosition[] | undefined;
  lentAssetsUSDValue: Big | undefined;
  totalEarnedInterestUSDValue: Big | undefined;
  borrowedAssetsUSDValue: Big | undefined;
  subsidyRewards: MonetaryAmount<CurrencyExt> | undefined;
  netYieldUSDValue: Big | undefined;
  collateralAssetsUSDValue: Big | undefined;
}

interface AccountLoansOverview {
  data: AccountLoansOverviewData;
  refetch: () => void;
}

const useGetAccountLoansOverview = (): AccountLoansOverview => {
  const accountId = useAccountId();
  const { data: assets, refetch: refetchLoanAssets } = useGetLoanAssets();

  const prices = useGetPrices();

  const {
    data: { lendPositions, borrowPositions },
    refetch: refetchPositions
  } = useGetAccountPositions(accountId);

  const { data: subsidyRewards, refetch: refetchSubsidyRewards } = useGetAccountSubsidyRewards(accountId);

  let lentAssetsUSDValue: Big | undefined = undefined;
  let totalEarnedInterestUSDValue: Big | undefined = undefined;
  let borrowedAssetsUSDValue: Big | undefined = undefined;
  let collateralAssetsUSDValue: Big | undefined = undefined;
  let totalAccruedUSDValue: Big | undefined = undefined;
  let netYieldUSDValue: Big | undefined = undefined;

  if (lendPositions !== undefined && prices !== undefined && assets !== undefined) {
    lentAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);
    totalEarnedInterestUSDValue = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);

    const collateralLendPositions = lendPositions
      .filter(({ isCollateral }) => isCollateral)
      .map(({ amount, currency, ...rest }) => ({
        // MEMO: compute total value based on collateral threshold (not full lend amount value)
        amount: amount.mul(assets[currency.ticker].collateralThreshold),
        currency,
        ...rest
      }));

    collateralAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    borrowedAssetsUSDValue = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);
  }

  if (borrowPositions !== undefined && prices !== undefined) {
    totalAccruedUSDValue = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);
  }

  if (totalEarnedInterestUSDValue !== undefined && subsidyRewards !== undefined && totalAccruedUSDValue !== undefined) {
    const totalSubsidyRewardsUSDValue =
      convertMonetaryAmountToValueInUSD(subsidyRewards, getTokenPrice(prices, subsidyRewards.currency.ticker)?.usd) ||
      0;
    netYieldUSDValue = totalEarnedInterestUSDValue.add(totalSubsidyRewardsUSDValue).sub(totalAccruedUSDValue);
  }

  const refetch = () => {
    refetchPositions();
    refetchLoanAssets();
    refetchSubsidyRewards();
  };

  return {
    data: {
      lendPositions,
      borrowPositions,
      lentAssetsUSDValue,
      totalEarnedInterestUSDValue,
      borrowedAssetsUSDValue,
      subsidyRewards,
      netYieldUSDValue,
      collateralAssetsUSDValue
    },
    refetch
  };
};

export { useGetAccountLoansOverview };
