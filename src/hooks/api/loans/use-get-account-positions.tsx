import { CurrencyExt, isCurrencyEqual, newMonetaryAmount } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { gql, GraphQLClient } from 'graphql-request';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { SQUID_URL } from '@/constants';
import { BorrowPosition, CollateralPosition } from '@/types/loans';
import { BLOCKTIME_REFETCH_INTERVAL } from '@/utils/constants/api';

import useAccountId from '../../use-account-id';
interface AccountPositionsData {
  lendPositions: CollateralPositionWithEarnedAmount[];
  borrowPositions: BorrowPosition[];
}

interface PositionsThresholdsData {
  collateral: Big;
  liquidation: Big;
}

interface CollateralPositionWithEarnedAmount extends CollateralPosition {
  earnedAmount?: MonetaryAmount<CurrencyExt>;
}

type UseGetAccountPositionsResult = {
  isLoading: boolean;
  getBorrowPosition: (currency: CurrencyExt) => BorrowPosition | undefined;
  getLendPosition: (currency: CurrencyExt) => CollateralPositionWithEarnedAmount | undefined;
  data: Partial<AccountPositionsData> & {
    hasCollateral: boolean;
  };
  refetch: () => void;
};

interface UseGetLendPositionsOfAccount {
  isLoading: boolean;
  data: Array<CollateralPositionWithEarnedAmount> | undefined;
  refetch: () => void;
}

interface UseGetBorrowPositionsOfAccount {
  isLoading: boolean;
  data: Array<BorrowPosition> | undefined;
  refetch: () => void;
}

const graphQLClient = new GraphQLClient(SQUID_URL, {
  headers: {
    'Content-Type': 'application/json'
  }
});

const getEarnedAmountQuery = (accountId: AccountId, currencies: Array<CurrencyExt>) => gql`
query loanDeposits {
  ${currencies
    .map(
      (currency) => `
  ${currency.ticker}: loanDepositsByAccountAndSymbol(symbol: "${
        currency.ticker
      }", userParachainAddress: "${accountId.toString()}") {
    sumDeposits
    sumWithdrawals
}
  `
    )
    .join(',')}
}

`;

const getLendPositionsWithEarnedAmounts = async (
  accountId: AccountId,
  lendPositions: Array<CollateralPosition>
): Promise<Array<CollateralPositionWithEarnedAmount>> => {
  const query = getEarnedAmountQuery(
    accountId,
    lendPositions.map(({ amount }) => amount.currency)
  );

  const lendingDepositsAndWithdrawals = await graphQLClient.request(query);

  const lendPositionsWithEarnedAmounts = lendPositions.map((position) => {
    const positionAmount = position.amount;

    const positionDeposits = lendingDepositsAndWithdrawals[positionAmount.currency.ticker].sumDeposits;
    const positionWithdrawals = lendingDepositsAndWithdrawals[positionAmount.currency.ticker].sumWithdrawals;
    const suppliedAmount = Big(positionDeposits).sub(positionWithdrawals);
    const suppliedAmountMonetary = newMonetaryAmount(suppliedAmount, positionAmount.currency);

    return { ...position, earnedAmount: positionAmount.sub(suppliedAmountMonetary) };
  });

  return lendPositionsWithEarnedAmounts;
};

const getLendPositionsOfAccount = async (
  accountId: AccountId | undefined
): Promise<Array<CollateralPositionWithEarnedAmount>> => {
  if (!accountId) {
    throw new Error('Something went wrong!');
  }

  const lendPositions = await window.bridge.loans.getLendPositionsOfAccount(accountId);

  try {
    const lendPositionsWithEarnedAmounts = await getLendPositionsWithEarnedAmounts(accountId, lendPositions);
    return lendPositionsWithEarnedAmounts;
  } catch (error) {
    console.error('Failed to fetch earned amounts for lend positions.', error);
    return lendPositions;
  }
};

const useGetLendPositionsOfAccount = (): UseGetLendPositionsOfAccount => {
  const accountId = useAccountId();

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['getLendPositionsOfAccount', accountId],
    queryFn: () => getLendPositionsOfAccount(accountId),
    enabled: !!accountId,
    refetchInterval: BLOCKTIME_REFETCH_INTERVAL
  });

  useErrorHandler(error);

  return { data, isLoading, refetch };
};

const useGetBorrowPositionsOfAccount = (): UseGetBorrowPositionsOfAccount => {
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

const useGetAccountPositions = (): UseGetAccountPositionsResult => {
  const {
    data: lendPositions,
    isLoading: isLendPositionsLoading,
    refetch: lendPositionsRefetch
  } = useGetLendPositionsOfAccount();

  const {
    data: borrowPositions,
    isLoading: isBorrowPositionsLoading,
    refetch: borrowPositionsRefetch
  } = useGetBorrowPositionsOfAccount();

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
    isLoading: isLendPositionsLoading || isBorrowPositionsLoading,
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
export type { AccountPositionsData, PositionsThresholdsData };
