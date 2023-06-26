import { CurrencyExt, InterbtcPrimitivesCurrencyId } from '@interlay/interbtc-api';
import { useQuery } from 'react-query';

import { useGetCurrencies } from '../use-get-currencies';

const getOracleCurrencies = (
  getCurrencyFromIdPrimitive: (currencyPrimitive: InterbtcPrimitivesCurrencyId) => CurrencyExt
) => async (): Promise<Array<CurrencyExt>> => {
  const keys = await window.bridge.api.query.oracle.aggregate.keys();

  // MEMO: Primitive decoding, because`storageKeyToNthInner` is not decoding proper OracleKey type
  const currencies = keys
    .map((key) => key.toHuman() as any)
    .filter((value) => value[0] !== 'FeeEstimation')
    .map(([{ ExchangeRate }]) =>
      getCurrencyFromIdPrimitive(window.bridge.api.createType('InterbtcPrimitivesCurrencyId', ExchangeRate))
    );

  return currencies;
};

interface UseGetOracleCurrenciesResult {
  data: Array<CurrencyExt> | undefined;
}

const useGetOracleCurrencies = (): UseGetOracleCurrenciesResult => {
  const { getCurrencyFromIdPrimitive, isLoading: isLoadingCurrencies } = useGetCurrencies(true);

  const { data } = useQuery({
    queryKey: 'getOracleCurrencies',
    queryFn: getOracleCurrencies(getCurrencyFromIdPrimitive),
    enabled: !isLoadingCurrencies
  });

  return { data };
};
export { useGetOracleCurrencies };
