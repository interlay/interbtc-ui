import * as React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { CurrencyUnit, ChainBalance, newAccountId } from '@interlay/interbtc-api';
import { Currency } from '@interlay/monetary-js';

import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { StoreType } from 'common/types/util.types';

// `D` stands for Decimals
const useTokenBalance = <D extends CurrencyUnit>(
  token: Currency<D>,
  accountAddress: string | undefined
): UseQueryResult<ChainBalance<CurrencyUnit>, Error> => {
  const { bridgeLoaded, address } = useSelector((state: StoreType) => state.general);

  // ray test touch <<
  // TODO: useAccountId
  const accountId = React.useMemo(() => {
    // eslint-disable-next-line max-len
    // TODO: should correct loading procedure according to https://kentcdodds.com/blog/application-state-management-with-react
    if (!bridgeLoaded) return;
    if (!address) return;

    return newAccountId(window.bridge.api, accountAddress || address);
  }, [bridgeLoaded, accountAddress, address]);
  // ray test touch >>

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
