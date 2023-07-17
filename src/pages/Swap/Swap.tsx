import { isCurrencyEqual } from '@interlay/interbtc-api';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { getPooledTickers } from '@/utils/helpers/pools';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import { usePageQueryParams } from '@/utils/hooks/use-page-query-params';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

const DEFAULT_PAIR: SwapPair = { input: RELAY_CHAIN_NATIVE_TOKEN };

const Swap = (): JSX.Element => {
  const { data: queryParams } = usePageQueryParams();
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);

  const { data: liquidityPools, refetch } = useGetLiquidityPools();
  const { data: currencies, getCurrencyFromTicker } = useGetCurrencies(bridgeLoaded);

  const [pair, setPair] = useState<SwapPair>(DEFAULT_PAIR);

  const pooledTickers = useMemo(() => liquidityPools && getPooledTickers(liquidityPools), [liquidityPools]);

  useEffect(() => {
    if (!currencies) return;

    const inputQuery = queryParams[QUERY_PARAMETERS.SWAP.FROM];
    const outputQuery = queryParams[QUERY_PARAMETERS.SWAP.TO];

    const fromCurrency = inputQuery ? getCurrencyFromTicker(inputQuery) : DEFAULT_PAIR.input;
    const toCurrency = outputQuery ? getCurrencyFromTicker(outputQuery) : DEFAULT_PAIR.output;

    setPair({ input: fromCurrency, output: toCurrency });
  }, [currencies, queryParams, getCurrencyFromTicker]);

  if (liquidityPools === undefined || pooledTickers === undefined) {
    return <FullLoadingSpinner />;
  }

  const liquidityPool = liquidityPools.find(
    (obj) =>
      obj.pooledCurrencies.some((amount) => pair.input && isCurrencyEqual(amount.currency, pair.input)) &&
      obj.pooledCurrencies.some((amount) => pair.output && isCurrencyEqual(amount.currency, pair.output))
  );

  const handleChangePair = (pair: SwapPair) => setPair(pair);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8'>
        <SwapForm
          pair={pair}
          liquidityPools={liquidityPools}
          onChangePair={handleChangePair}
          onSwap={refetch}
          pooledTickers={pooledTickers}
        />
        {pair.input && pair.output && (
          <SwapLiquidity input={pair.input} output={pair.output} liquidityPool={liquidityPool} />
        )}
      </StyledWrapper>
    </MainContainer>
  );
};

export default Swap;
