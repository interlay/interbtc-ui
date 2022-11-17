import { BorrowPosition, LendPosition } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries, useQueryClient } from 'react-query';

interface AccountPositionsData {
  data: {
    lendPositions: Array<LendPosition> | undefined;
    borrowPositions: Array<BorrowPosition> | undefined;
  };
  refetch: () => void;
}

const getAccountLendPositions = (accountId: AccountId): Promise<Array<LendPosition>> =>
  window.bridge.loans.getLendPositionsOfAccount(accountId);

const getAccountBorrowPositions = (accountId: AccountId): Promise<Array<BorrowPosition>> =>
  window.bridge.loans.getBorrowPositionsOfAccount(accountId);

const useGetAccountPositions = (accountId: AccountId | undefined): AccountPositionsData => {
  const [
    { data: lendPositionsData, error: lendPositionsError },
    { data: borrowPositionsData, error: borrowPositionsError }
  ] = useQueries([
    {
      queryKey: ['lend-positions', accountId?.toString()],
      queryFn: () => accountId && getAccountLendPositions(accountId),
      enabled: !!accountId,
      initialData: [],
      refetchInterval: 12000
    },
    {
      queryKey: ['borrow-positions', accountId?.toString()],
      queryFn: () => accountId && getAccountBorrowPositions(accountId),
      enabled: !!accountId,
      initialData: [],
      refetchInterval: 12000
    }
  ]);

  useErrorHandler(lendPositionsError);
  useErrorHandler(borrowPositionsError);

  const queryClient = useQueryClient();

  const refetch = () => {
    queryClient.invalidateQueries(['lend-positions', accountId?.toString()]);
    queryClient.invalidateQueries(['borrow-positions', accountId?.toString()]);
  };

  return {
    refetch,
    data: {
      lendPositions: lendPositionsData,
      borrowPositions: borrowPositionsData
    }
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData };
