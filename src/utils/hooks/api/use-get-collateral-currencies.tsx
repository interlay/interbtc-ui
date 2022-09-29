import { CollateralCurrencyExt, getCollateralCurrencies } from '@interlay/interbtc-api';
import { useQuery, UseQueryResult } from 'react-query';

const getCurrencies = async (): Promise<Array<CollateralCurrencyExt>> =>
  getCollateralCurrencies(window.bridge.api, window.bridge.assetRegistry);

const useGetCollateralCurrencies = (bridgeLoaded: boolean): UseQueryResult<Array<CollateralCurrencyExt>> => {
  return useQuery({ queryKey: 'getCollateralCurrencies', queryFn: getCurrencies, enabled: bridgeLoaded });
};

export { useGetCollateralCurrencies };
