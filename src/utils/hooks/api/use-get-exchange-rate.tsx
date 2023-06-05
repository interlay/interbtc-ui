import { CurrencyExt } from '@interlay/interbtc-api';
import { Currency, ExchangeRate } from '@interlay/monetary-js';
import { useErrorHandler } from 'react-error-boundary';
import { useQuery, UseQueryResult } from 'react-query';

type UseGetExchangeRateResult = UseQueryResult<ExchangeRate<Currency, CurrencyExt>, unknown>;

const getExchangeRateData = (
  collateralCurrency: CurrencyExt,
  wrappedCurrency?: Currency
): Promise<ExchangeRate<Currency, CurrencyExt>> =>
  window.bridge.oracle.getExchangeRate(collateralCurrency, wrappedCurrency);

const useGetExchangeRate = (collateralCurrency: CurrencyExt, wrappedCurrency?: Currency): UseGetExchangeRateResult => {
  const queryResult = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: () => getExchangeRateData(collateralCurrency, wrappedCurrency)
  });

  useErrorHandler(queryResult.error);

  return queryResult;
};

export { useGetExchangeRate };
export type { UseGetExchangeRateResult };
