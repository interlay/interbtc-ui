import { CollateralCurrencyExt, getCorrespondingCollateralCurrencies } from '@interlay/interbtc-api';
import { useQuery, UseQueryResult } from 'react-query';

const getCollateralCurrencies = async (): Promise<Array<CollateralCurrencyExt>> => {
  const nativeCollateralCurrencies = getCorrespondingCollateralCurrencies(window.bridge.getGovernanceCurrency());
  const foreignCurrencies = await window.bridge.assetRegistry.getCollateralForeignAssets();
  return [...nativeCollateralCurrencies, ...foreignCurrencies];
};

const useGetCollateralCurrencies = (bridgeLoaded: boolean): UseQueryResult<Array<CollateralCurrencyExt>> => {
  return useQuery({ queryKey: 'getCollateralCurrencies', queryFn: getCollateralCurrencies, enabled: bridgeLoaded });
};

export { useGetCollateralCurrencies };
