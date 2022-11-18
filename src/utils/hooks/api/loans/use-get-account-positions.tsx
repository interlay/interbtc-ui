import { BorrowPosition, CurrencyExt, LendPosition } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

import { Prices, useGetPrices } from '../use-get-prices';
import { useGetLoanAssets } from './use-get-loan-assets';
import { getPositionsSumOfFieldsInUSD, getTotalEarnedRewards } from './utils';

interface AccountPositionsData {
  lendPositions: LendPosition[];
  borrowPositions: BorrowPosition[];
  // stats: {
  // earnedRewards: MonetaryAmount<CurrencyExt> | undefined;
  //   supplyAmountUSD: Big | undefined;
  //   borrowAmountUSD: Big | undefined;
  //   collateralAmountUSD: Big | undefined;
  //   earnedInterestAmountUSD: Big | undefined;
  //   earnedDeptAmountUSD: Big | undefined;
  //   netYieldAmountUSD: Big | undefined;
  // };
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

  // const earnedRewards = getTotalEarnedRewards(lendPositions, borrowPositions);

  // const supplyAmountUSD = getPositionsSumOfFieldsInUSD('amount', lendPositions, prices);
  // const earnedInterestAmountUSD = getPositionsSumOfFieldsInUSD<LendPosition>('earnedInterest', lendPositions, prices);

  // const collateralAmountUSD = lendPositions.reduce((amount, position) => {

  // })

  // return {
  //   borrowPositions,
  //   lendPositions,
  //   earnedRewards,
  //   stats: { supplyAmountUSD, earnedInterestAmountUSD ,collateralAmountUSD}
  // };
};

const useGetAccountPositions = (
  accountId: AccountId | undefined
): UseQueryResult<AccountPositionsData | undefined, unknown> => {
  const query = useQuery({
    queryKey: 'positions',
    queryFn: () => accountId && getAccountPositionsQuery(accountId),
    enabled: !!accountId,
    refetchInterval: 12000
  });

  useErrorHandler(query.error);

  return query;
};

export { useGetAccountPositions };
export type { AccountPositionsData };
