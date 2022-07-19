// ray test touch <
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { AccountId } from '@polkadot/types/interfaces';
import { CurrencyUnit, ChainBalance } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';

import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

const useTokenBalance = <Decimals extends CurrencyUnit>(
  token: Currency<Decimals>,
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

export default useTokenBalance;
// ray test touch >
