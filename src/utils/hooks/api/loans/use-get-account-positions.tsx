import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useMemo } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { Prices, useGetPrices } from '../use-get-prices';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD } from './utils';

interface AccountPositionsData {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
}

const getAccountLendPositions = (accountId: AccountId): Promise<Array<LendPosition>> =>
  window.bridge.loans.getLendPositionsOfAccount(accountId);

const getAccountBorrowPositions = (accountId: AccountId): Promise<Array<BorrowPosition>> =>
  window.bridge.loans.getBorrowPositionsOfAccount(accountId);

const getAccountPositionsQuery = async (accountId: AccountId): Promise<AccountPositionsData> => {
  const [lendPositions, borrowPositions] = await Promise.all([
    getAccountLendPositions(accountId),
    getAccountBorrowPositions(accountId)
  ]);

  return {
    borrowPositions,
    lendPositions
  };
};

interface PositionsThresholdsData {
  collateral: Big;
  liquidation: Big;
}

const getPositionsThresholds = (
  lendPositions: LendPosition[],
  assets: TickerToData<LoanAsset>
): PositionsThresholdsData | undefined => {
  const collateralPositions = lendPositions.filter(({ isCollateral }) => isCollateral);

  if (!collateralPositions.length) {
    return undefined;
  }

  const totalCollateralThreshold = collateralPositions.reduce(
    (total, position) => total.add(assets[position.currency.ticker].collateralThreshold),
    new Big(0)
  );

  const totalLiquidationThreshold = collateralPositions.reduce(
    (total, position) => total.add(assets[position.currency.ticker].liquidationThreshold),
    new Big(0)
  );

  return {
    collateral: totalCollateralThreshold.div(collateralPositions.length),
    liquidation: totalLiquidationThreshold.div(collateralPositions.length)
  };
};

interface AccountPositionsStatisticsData {
  supplyAmountUSD: Big;
  borrowAmountUSD: Big;
  collateralAmountUSD: Big;
  earnedInterestAmountUSD: Big;
  earnedDeptAmountUSD: Big;
  netYieldAmountUSD: Big;
}

const getAccountPositionsStats = (
  assets: TickerToData<LoanAsset>,
  lendPositions: LendPosition[],
  borrowPositions: BorrowPosition[],
  subsidyRewards: MonetaryAmount<CurrencyExt>,
  prices: Prices
): AccountPositionsStatisticsData => {
  const supplyAmountUSD = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);

  const borrowAmountUSD = getPositionsSumOfFieldsInUSD('amount', borrowPositions, prices);

  const collateralLendPositions = lendPositions
    .filter(({ isCollateral }) => isCollateral)
    .map(({ amount, currency, ...rest }) => ({
      // MEMO: compute total value based on collateral threshold (not full lend amount value)
      amount: amount.mul(assets[currency.ticker].collateralThreshold),
      currency,
      ...rest
    }));

  const collateralAmountUSD = getPositionsSumOfFieldsInUSD('amount', collateralLendPositions, prices);

  const earnedInterestAmountUSD = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);
  const earnedDeptAmountUSD = getPositionsSumOfFieldsInUSD('accumulatedDebt', borrowPositions, prices);

  const totalEarnedRewardsUSDValue =
    convertMonetaryAmountToValueInUSD(subsidyRewards, getTokenPrice(prices, subsidyRewards.currency.ticker)?.usd) || 0;
  const netYieldAmountUSD = earnedInterestAmountUSD.add(totalEarnedRewardsUSDValue).sub(earnedDeptAmountUSD);

  return {
    supplyAmountUSD,
    borrowAmountUSD,
    earnedInterestAmountUSD,
    collateralAmountUSD,
    earnedDeptAmountUSD,
    netYieldAmountUSD
  };
};

type UseGetAccountPositions = {
  data: Partial<AccountPositionsData> & {
    statistics: AccountPositionsStatisticsData | undefined;
    thresholds: PositionsThresholdsData | undefined;
  };
  refetch: () => void;
};

const useGetAccountPositions = (): UseGetAccountPositions => {
  const accountId = useAccountId();

  const prices = useGetPrices();
  const { data: assets } = useGetLoanAssets();

  const { data: positions, error: positionsError, refetch: refetchPositions } = useQuery({
    queryKey: ['positions', accountId],
    queryFn: () => accountId && getAccountPositionsQuery(accountId),
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  const { data: subsidyRewards } = useGetAccountSubsidyRewards();

  // MEMO: we dont need assets as a dependency, since we only use the collateral threshold and
  // it's value is very unlikely to change
  const statistics = useMemo(() => {
    if (!assets || !positions || !subsidyRewards || !prices) {
      return undefined;
    }

    return getAccountPositionsStats(assets, positions.lendPositions, positions.borrowPositions, subsidyRewards, prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, prices, subsidyRewards]);

  const thresholds = useMemo(() => {
    if (!positions || !assets) {
      return undefined;
    }

    return getPositionsThresholds(positions.lendPositions, assets);
  }, [assets, positions]);

  useErrorHandler(positionsError);

  return {
    data: {
      borrowPositions: positions?.borrowPositions,
      lendPositions: positions?.lendPositions,
      thresholds,
      statistics
    },
    refetch: refetchPositions
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData, AccountPositionsStatisticsData, PositionsThresholdsData };
