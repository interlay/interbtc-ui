import { BorrowPosition, CurrencyExt, LendPosition, LoanAsset, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useMemo } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { convertMonetaryAmountToValueInUSD } from '@/common/utils/utils';
import { getSubsidyRewardApy } from '@/pages/Loans/LoansOverview/utils/get-subsidy-rewards-apy';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';
import { getTokenPrice } from '@/utils/helpers/prices';

import useAccountId from '../../use-account-id';
import { Prices, useGetPrices } from '../use-get-prices';
import { BorrowPositionExt, LendPositionExt } from './type';
import { useGetAccountSubsidyRewards } from './use-get-account-subsidy-rewards';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD } from './utils';

interface AccountPositionsData {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
}

interface AccountPositionsExtData {
  lendPositions: LendPositionExt[];
  borrowPositions: BorrowPositionExt[];
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

const getPositionAmountUSD = (position: LendPosition | BorrowPosition, prices: Prices): Big | undefined => {
  const price = getTokenPrice(prices, position.currency.ticker);
  return price?.usd ? position.amount.toBig().mul(price.usd) : undefined;
};

const getExtendedPositions = async (
  accountId: AccountId,
  assets: TickerToData<LoanAsset>,
  prices: Prices
): Promise<AccountPositionsExtData> => {
  const positions = await getAccountPositionsQuery(accountId);

  const borrowPositions: BorrowPositionExt[] = positions.borrowPositions.map((position) => {
    const amountUSD = getPositionAmountUSD(position, prices);
    const { borrowReward, borrowApy } = assets[position.currency.ticker];

    const rewardsApy = getSubsidyRewardApy(position.currency, borrowReward, prices);

    return {
      ...position,
      amountUSD,
      rewardsApy,
      totalApy: borrowApy.sub(rewardsApy || 0)
    };
  });

  const lendPositions: LendPositionExt[] = positions.lendPositions.map((position) => {
    const amountUSD = getPositionAmountUSD(position, prices);
    const { lendReward, lendApy } = assets[position.currency.ticker];

    const rewardsApy = getSubsidyRewardApy(position.currency, lendReward, prices);

    return {
      ...position,
      amountUSD,
      rewardsApy,
      totalApy: lendApy.add(rewardsApy || 0)
    };
  });

  return {
    borrowPositions,
    lendPositions
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
  data: Partial<AccountPositionsExtData> & {
    statistics: AccountPositionsStatisticsData | undefined;
  };
  refetch: () => void;
};

const useGetAccountPositions = (): UseGetAccountPositions => {
  const accountId = useAccountId();

  const prices = useGetPrices();
  const { data: assets } = useGetLoanAssets();

  const { data: positions, error: positionsError, refetch: refetchPositions } = useQuery({
    queryKey: ['positions', accountId],
    queryFn: () => accountId && assets && prices && getExtendedPositions(accountId, assets, prices),
    enabled: !!accountId && !!prices && !!assets,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  const { data: subsidyRewards } = useGetAccountSubsidyRewards();

  // const extendedPositions = useMemo(() => {}, []);

  // MEMO: we dont need assets as a dependency, since we only use the collateral threshold and
  // it's value is very unlikely to change
  const statistics = useMemo(() => {
    if (!assets || !positions || !subsidyRewards || !prices) {
      return undefined;
    }

    return getAccountPositionsStats(assets, positions.lendPositions, positions.borrowPositions, subsidyRewards, prices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, prices, subsidyRewards]);

  useErrorHandler(positionsError);

  return {
    data: {
      borrowPositions: positions?.borrowPositions,
      lendPositions: positions?.lendPositions,
      statistics
    },
    refetch: refetchPositions
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData, AccountPositionsStatisticsData };
