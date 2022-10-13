import { BorrowPosition, LendPosition } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries } from 'react-query';

interface AccountPositionsData {
  lendPositions: Array<LendPosition> | undefined;
  borrowPositions: Array<BorrowPosition> | undefined;
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
      initialData: []
    },
    {
      queryKey: ['borrow-positions', accountId?.toString()],
      queryFn: () => accountId && getAccountBorrowPositions(accountId),
      enabled: !!accountId,
      initialData: []
    }
  ]);

  useErrorHandler(lendPositionsError);
  useErrorHandler(borrowPositionsError);

  return {
    lendPositions: lendPositionsData && lendPositionsData,
    borrowPositions: borrowPositionsData && borrowPositionsData
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData };
