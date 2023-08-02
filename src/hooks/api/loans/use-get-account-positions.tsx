import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { BorrowPosition, CollateralPosition } from '@/types/loans';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
import { useGetAccountPositionsEarnings } from './use-get-account-positions-earnings';

const getLendPositionsOfAccount = async (accountId: AccountId): Promise<Array<CollateralPosition>> =>
  window.bridge.loans.getLendPositionsOfAccount(accountId);

interface UseGetLendPositionsOfAccountResult {
  isLoading: boolean;
  data: Array<CollateralPosition> | undefined;
  refetch: () => void;
}

const useGetLendPositionsOfAccount = (): UseGetLendPositionsOfAccountResult => {
  const accountId = useAccountId();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['getLendPositionsOfAccount', accountId],
    queryFn: () => accountId && getLendPositionsOfAccount(accountId),
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, isLoading, refetch };
};

interface UseGetBorrowPositionsOfAccountResult {
  isLoading: boolean;
  data: Array<BorrowPosition> | undefined;
  refetch: () => void;
}

const useGetBorrowPositionsOfAccount = (): UseGetBorrowPositionsOfAccountResult => {
  const accountId = useAccountId();

  const { data, error, refetch, isLoading } = useQuery({
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

  return { data, isLoading, refetch };
};

interface AccountPositionsData {
  lendPositions: CollateralPosition[];
  borrowPositions: BorrowPosition[];
}

type UseGetAccountPositionsResult = {
  isLoading: boolean;
  getBorrowPosition: (currency: CurrencyExt) => BorrowPosition | undefined;
  getLendPosition: (currency: CurrencyExt) => CollateralPosition | undefined;
  data: Partial<AccountPositionsData> & {
    hasCollateral: boolean;
  };
  refetch: () => void;
};

const useGetAccountPositions = (): UseGetAccountPositionsResult => {
  const {
    data: lendPositionsWithoutEarnings,
    isLoading: isLendPositionsLoading,
    refetch: lendPositionsRefetch
  } = useGetLendPositionsOfAccount();

  const {
    data: borrowPositions,
    isLoading: isBorrowPositionsLoading,
    refetch: borrowPositionsRefetch
  } = useGetBorrowPositionsOfAccount();

  const { getPositionEarnings, isLoading: isAccountEarningsLoading } = useGetAccountPositionsEarnings(
    lendPositionsWithoutEarnings
  );

  const lendPositions: CollateralPosition[] | undefined = lendPositionsWithoutEarnings?.map((position) => ({
    ...position,
    earnedAmount: getPositionEarnings(position.amount.currency.ticker)
  }));

  const getBorrowPosition = useCallback(
    (currency: CurrencyExt) => {
      return borrowPositions?.find((position) => isCurrencyEqual(position.amount.currency, currency));
    },
    [borrowPositions]
  );

  const getLendPosition = useCallback(
    (currency: CurrencyExt) => {
      return lendPositions?.find((position) => isCurrencyEqual(position.amount.currency, currency));
    },
    [lendPositions]
  );

  return {
    isLoading: isLendPositionsLoading || isBorrowPositionsLoading || isAccountEarningsLoading,
    data: {
      borrowPositions: borrowPositions,
      lendPositions: lendPositions,
      hasCollateral: !!lendPositions?.find((position) => position.isCollateral)
    },
    refetch: () => {
      lendPositionsRefetch();
      borrowPositionsRefetch();
    },
    getBorrowPosition,
    getLendPosition
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData };
