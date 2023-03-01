import {
  BorrowPosition,
  CurrencyExt,
  LendPosition,
  LoanAsset,
  LoanCollateralInfo,
  TickerToData
} from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import Big from 'big.js';
import * as React from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/pages/Loans/LoansOverview/utils/get-subsidy-rewards-apy';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';
import { useGetLoanAssets } from '@/utils/hooks/api/loans/use-get-loan-assets';
import useAccountId from '@/utils/hooks/use-account-id';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { getPositionsSumOfFieldsInUSD } from './utils';

const useGetLendPositionsOfAccount = (): {
  data: Array<LendPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getLendPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getLendPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

const useGetBorrowPositionsOfAccount = (): {
  data: Array<BorrowPosition> | undefined;
  refetch: () => void;
} => {
  const accountId = useAccountId();

  const { data, error, refetch } = useQuery({
    queryKey: ['getBorrowPositionsOfAccount', accountId],
    queryFn: async () => {
      if (!accountId) {
        throw new Error('Something went wrong!');
      }

      return await window.bridge.loans.getBorrowPositionsOfAccount(accountId);
    },
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, refetch };
};

interface AccountPositionsStatisticsData {
  supplyAmountUSD: Big;
  borrowAmountUSD: Big;
  collateralAmountUSD: Big;
  liquidationAmountUSD: Big;
  collateralizedAmountUSD: Big;
  earnedInterestAmountUSD: Big;
  earnedDeptAmountUSD: Big;
  netAmountUSD: Big;
  netAPY: Big;
}

const getNetAPY = (
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  assets: TickerToData<LoanAsset>,
  supplyAmountUSD: Big,
  prices: Prices
): Big => {
  if (!supplyAmountUSD.gt(0)) {
    return new Big(0);
  }

  const totalLendApy = lendPositions.reduce((total, position) => {
    const { lendApy, lendReward } = assets[position.currency.ticker];
    const rewardsApy = getSubsidyRewardApy(position.currency, lendReward, prices);
    const positionApy = lendApy.add(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, position.currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  const totalBorrowApy = borrowPositions.reduce((total, position) => {
    const { borrowApy, borrowReward } = assets[position.currency.ticker];
    const rewardsApy = getSubsidyRewardApy(position.currency, borrowReward, prices);
    const positionApy = borrowApy.sub(rewardsApy || 0);
    const positionUSDValue = convertMonetaryAmountToValueInUSD(
      position.amount,
      getTokenPrice(prices, position.currency.ticker)?.usd
    );

    return positionUSDValue ? total.add(positionApy.mul(positionUSDValue)) : total;
  }, new Big(0));

  return totalLendApy.sub(totalBorrowApy).div(supplyAmountUSD);
};

const getAccountPositionsStats = (
  assets: TickerToData<LoanAsset>,
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  subsidyRewards: MonetaryAmount<CurrencyExt>,
  prices: Prices
): AccountPositionsStatisticsData => {
  const supplyAmountUSD = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);

  const borrowAmountUSD = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);

  const collateralLendPositions = lendPositions.filter(({ isCollateral }) => isCollateral);

  const collateralPositionsWithAppliedCollateralThreshold = collateralLendPositions.map(
    ({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].collateralThreshold),
      currency,
      ...rest
    })
  );

  const collateralPositionsWithAppliedLiquidationThreshold = collateralLendPositions.map(
    ({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].liquidationThreshold),
      currency,
      ...rest
    })
  );

  const collateralAmountUSD = getPositionsSumOfFieldsInUSD(
    'amount',
    collateralPositionsWithAppliedCollateralThreshold,
    prices
  );
  const liquidationAmountUSD = getPositionsSumOfFieldsInUSD(
    'amount',
    collateralPositionsWithAppliedLiquidationThreshold,
    prices
  );

  const collateralizedAmountUSD = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);
  const earnedDeptAmountUSD = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);

  // TODO: This is temporary, at least until earned interest
  // is moved into squid.
  // const totalEarnedRewardsUSDValue =
  //   convertMonetaryAmountToValueInUSD(subsidyRewards, getTokenPrice(prices, subsidyRewards.currency.ticker)?.usd) || 0;
  // const netAmountUSD = earnedInterestAmountUSD.add(totalEarnedRewardsUSDValue).sub(earnedDeptAmountUSD);

  const netAPY = getNetAPY(lendPositions, borrowPositions, assets, supplyAmountUSD, prices);

  return {
    supplyAmountUSD,
    borrowAmountUSD,
    earnedInterestAmountUSD: new Big(0),
    collateralAmountUSD,
    liquidationAmountUSD,
    collateralizedAmountUSD,
    earnedDeptAmountUSD,
    netAmountUSD: new Big(0),
    netAPY
  };
};

const useLoanInfo = (): {
  data: {
    loanCollateralInfo: LoanCollateralInfo | undefined;
    statistics: AccountPositionsStatisticsData | undefined;
  };
  refetch: () => void;
} => {
  const { data: lendPositions, refetch: lendPositionsRefetch } = useGetLendPositionsOfAccount();

  const { data: borrowPositions, refetch: borrowPositionsRefetch } = useGetBorrowPositionsOfAccount();

  const { data: loanAssets, refetch: loanAssetsRefetch } = useGetLoanAssets();

  const prices = useGetPrices();

  const { data: subsidyRewards, refetch: subsidyRewardsRefetch } = useGetAccountSubsidyRewards();

  // MEMO: we don't need assets as a dependency, since we only use the collateral threshold and
  // it's value is very unlikely to change
  const statistics = React.useMemo(() => {
    if (!loanAssets || !lendPositions || !borrowPositions || !subsidyRewards || !prices) {
      return undefined;
    }

    return getAccountPositionsStats(loanAssets, lendPositions, borrowPositions, subsidyRewards, prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lendPositions, borrowPositions, prices, subsidyRewards]);

  const loanCollateralInfo =
    !lendPositions || !borrowPositions || !loanAssets
      ? undefined
      : window.bridge.loans.getLoanCollateralInfo(lendPositions, borrowPositions, loanAssets);

  return {
    data: {
      loanCollateralInfo,
      statistics
    },
    refetch: () => {
      lendPositionsRefetch();
      borrowPositionsRefetch();
      loanAssetsRefetch();
      subsidyRewardsRefetch();
    }
  };
};

export { useGetBorrowPositionsOfAccount, useGetLendPositionsOfAccount, useLoanInfo };

export type { AccountPositionsStatisticsData };
