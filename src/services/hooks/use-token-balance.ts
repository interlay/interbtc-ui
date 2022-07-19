import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { CurrencyUnit, ChainBalance } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';

import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import useAccountId from 'utils/hooks/use-account-id';
import { StoreType } from 'common/types/util.types';

// `D` stands for Decimals
const useTokenBalance = <D extends CurrencyUnit>(
  token: Currency<D>,
  accountAddress: string | undefined
): UseQueryResult<ChainBalance<CurrencyUnit>, Error> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const accountId = useAccountId(accountAddress);

  return useQuery<ChainBalance<CurrencyUnit>, Error>(
    [GENERIC_FETCHER, 'tokens', 'balance', token, accountId],
    genericFetcher<ChainBalance<CurrencyUnit>>(),
    {
      enabled: !!bridgeLoaded && !!accountId
    }
  );
};

// ray test touch <<
// const useGovernanceTokenBalance = () => {};
// ray test touch >>

export default useTokenBalance;
