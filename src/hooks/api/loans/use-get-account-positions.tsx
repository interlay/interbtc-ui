import { CurrencyExt, isCurrencyEqual } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { useWallet } from '@/lib/wallet';
import { BorrowPosition, CollateralPosition } from '@/types/loans';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import { useGetAccountPositionsEarnings } from './use-get-account-positions-earnings';

const getLendPositionsOfAccount = async (accountId: AccountId): Promise<Array<CollateralPosition>> =>
  window.bridge.loans.getLendPositionsOfAccount(accountId);

interface UseGetLendPositionsOfAccountResult {
  isLoading: boolean;
  data: Array<CollateralPosition> | undefined;
  refetch: () => void;
}

const useGetLendPositionsOfAccount = (): UseGetLendPositionsOfAccountResult => {
  const { account } = useWallet();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['getLendPositionsOfAccount', account?.address],
    queryFn: () => account && getLendPositionsOfAccount(account.id),
    enabled: !!account,
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
  const { account } = useWallet();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['getBorrowPositionsOfAccount', account?.address],
    queryFn: () => account && window.bridge.loans.getBorrowPositionsOfAccount(account?.id),
    enabled: !!account,
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
