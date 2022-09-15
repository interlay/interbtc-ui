import { CollateralCurrencyExt, CurrencyExt } from '@interlay/interbtc-api';
import { Currency, ExchangeRate } from '@interlay/monetary-js';
import Big from 'big.js';
import { useQuery, UseQueryResult } from 'react-query';

import { useGetCollateralCurrencies } from './use-get-collateral-currencies';

type CollateralCurrenciesData = { [currencyTicker: string]: CollateralCurrencyData };

type CollateralCurrencyData = {
  liquidationThreshold: Big;
  secureThreshold: Big;
  exchangeRate: ExchangeRate<Currency, CurrencyExt>;
};

const getCollateralCurrencyData = async (collateralToken: CollateralCurrencyExt): Promise<CollateralCurrencyData> => {
  const [liquidationThreshold, secureThreshold, exchangeRate] = await Promise.all([
    window.bridge.vaults.getLiquidationCollateralThreshold(collateralToken),
    window.bridge.vaults.getSecureCollateralThreshold(collateralToken),
    window.bridge.oracle.getExchangeRate(collateralToken)
  ]);

  return { liquidationThreshold, secureThreshold, exchangeRate };
};

const getCollateralCurrenciesData = (
  collateralCurrencies: Array<CollateralCurrencyExt>
) => async (): Promise<CollateralCurrenciesData> => {
  const allData = await Promise.all(
    collateralCurrencies.map((item: CollateralCurrencyExt) => getCollateralCurrencyData(item))
  );

  // TODO: handle types properly
  return allData.reduce(
    (result, data, index) => ({
      ...result,
      [collateralCurrencies[index].ticker]: data
    }),
    {}
  ) as CollateralCurrenciesData;
};

const useGetCollateralCurrenciesData = (bridgeLoaded: boolean): UseQueryResult<CollateralCurrenciesData> => {
  const { data: collateralCurrencies, isSuccess: isSuccessCollateralCurrencies } = useGetCollateralCurrencies(
    bridgeLoaded
  );

  return useQuery({
    queryKey: 'getCollateralCurrenciesData',
    queryFn: getCollateralCurrenciesData(collateralCurrencies || []),
    enabled: bridgeLoaded && isSuccessCollateralCurrencies
  });
};

export { useGetCollateralCurrenciesData };
