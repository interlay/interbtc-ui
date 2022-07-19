import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import { CurrencyUnit, ChainBalance } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';

import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// `D` stands for Decimals
const useTokenBalance = <D extends CurrencyUnit>(
  token: Currency<D>,
  accountId: AccountId | undefined
): UseQueryResult<ChainBalance<CurrencyUnit>, Error> => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  return useQuery<ChainBalance<CurrencyUnit>, Error>(
    [GENERIC_FETCHER, 'tokens', 'balance', token, accountId],
    genericFetcher<ChainBalance<CurrencyUnit>>(),
    {
      enabled: !!bridgeLoaded && !!accountId
    }
  );
};

// ray test touch <
// const useGovernanceTokenBalance = () => {};
// ray test touch >

export default useTokenBalance;
