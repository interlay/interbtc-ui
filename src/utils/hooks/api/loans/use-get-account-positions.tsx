import { BorrowPosition, LendPosition, TickerToData } from '@interlay/interbtc-api';
import { AccountId } from '@polkadot/types/interfaces';
import { useErrorHandler } from 'react-error-boundary';
import { useQueries } from 'react-query';

// TODO: Check if lend and borrow positions need to be constructed as a mapping or can be used as array instead.

interface AccountPositionsData {
  lendPositions: Array<LendPosition> | undefined;
  borrowPositions: Array<BorrowPosition> | undefined;
}

const getAccountLendPositions = (accountId: AccountId): Promise<TickerToData<LendPosition>> => {
  return window.bridge.loans.getLendPositionsOfAccount(accountId);
};
const getAccountBorrowPositions = (accountId: AccountId): Promise<TickerToData<BorrowPosition>> => {
  return window.bridge.loans.getBorrowPositionsOfAccount(accountId);
};

const useGetAccountPositions = (accountId: AccountId | undefined): AccountPositionsData => {
  const [
    { data: lendPositionsData, error: lendPositionsError },
    { data: borrowPositionsData, error: borrowPositionsError }
  ] = useQueries([
    {
      queryKey: ['lend-positions', accountId?.toString()],
      queryFn: async () => accountId && (await getAccountLendPositions(accountId)),
      enabled: !!accountId
    },
    {
      queryKey: ['borrow-positions', accountId?.toString()],
      queryFn: async () => accountId && (await getAccountBorrowPositions(accountId)),
      enabled: !!accountId
    }
  ]);

  useErrorHandler(lendPositionsError);
  useErrorHandler(borrowPositionsError);

  if (accountId === undefined) {
    return { lendPositions: undefined, borrowPositions: undefined };
  }

  return {
    lendPositions: lendPositionsData && Object.values(lendPositionsData),
    borrowPositions: borrowPositionsData && Object.values(borrowPositionsData)
  };
};

export { useGetAccountPositions };
export type { AccountPositionsData };
