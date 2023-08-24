import { CurrencyExt, newMonetaryAmount, TickerToData } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { AccountId } from '@polkadot/types/interfaces';
import Big from 'big.js';
import { gql, GraphQLClient } from 'graphql-request';
import { useCallback } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery } from 'react-query';

import { SQUID_URL } from '@/constants';
import { useWallet } from '@/hooks/use-wallet';
import { CollateralPosition } from '@/types/loans';
import { REFETCH_INTERVAL } from '@/utils/constants/api';

type GetAccountPositionsEarningsData = TickerToData<MonetaryAmount<CurrencyExt>>;

const graphQLClient = new GraphQLClient(SQUID_URL, {
  headers: {
    'Content-Type': 'application/json'
  }
});

const getEarnedAmountQuery = (account: string, currencies: Array<string>) => gql`
query loanDeposits {
  ${currencies
    .map(
      (ticker) => `${ticker}: loanDepositsByAccountAndSymbol(symbol: "${ticker}", userParachainAddress: "${account}") {
      sumDeposits
      sumWithdrawals
    }
  `
    )
    .join(',')}
}

`;

const getEarnedAmountByTicker = async (
  account: string,
  lendPositions: Array<CollateralPosition>
): Promise<GetAccountPositionsEarningsData | undefined> => {
  if (!lendPositions.length) {
    return undefined;
  }

  const query = getEarnedAmountQuery(
    account,
    lendPositions.map(({ amount }) => amount.currency.ticker)
  );

  const lendingDepositsAndWithdrawals = await graphQLClient.request(query);

  return lendPositions.reduce((acc, position) => {
    const { currency } = position.amount;
    const { sumDeposits, sumWithdrawals } = lendingDepositsAndWithdrawals[currency.ticker];

    const suppliedAmount = Big(sumDeposits).sub(sumWithdrawals);
    const suppliedMonetaryAmount = newMonetaryAmount(suppliedAmount, currency);

    return { ...acc, [currency.ticker]: position.amount.sub(suppliedMonetaryAmount) };
  }, {});
};

type UseGetAccountPositionsEarningsResult = {
  isLoading: boolean;
  getPositionEarnings: (ticker: string) => MonetaryAmount<CurrencyExt> | undefined;
  data: GetAccountPositionsEarningsData | undefined;
  refetch: () => void;
};

const useGetAccountPositionsEarnings = (
  lendPositions: CollateralPosition[] | undefined,
  proxyAccount?: AccountId
): UseGetAccountPositionsEarningsResult => {
  const { account } = useWallet();

  const { refetch, isLoading, data, error } = useQuery({
    queryKey: ['loan-earnings', account, proxyAccount],
    queryFn: () =>
      lendPositions &&
      account &&
      getEarnedAmountByTicker(proxyAccount?.toString() || account.toString(), lendPositions),
    enabled: !!lendPositions && !!account,
    refetchOnWindowFocus: false,
    refetchInterval: REFETCH_INTERVAL.MINUTE
  });

  useErrorHandler(error);

  const getPositionEarnings = useCallback((ticker: string) => data?.[ticker], [data]);

  return {
    isLoading,
    data,
    refetch,
    getPositionEarnings
  };
};

export { useGetAccountPositionsEarnings };
export type { GetAccountPositionsEarningsData, UseGetAccountPositionsEarningsResult };
