import { isCurrencyEqual } from '@interlay/interbtc-api';
import { useEffect, useMemo, useState } from 'react';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import { QUERY_PARAMETERS } from '@/utils/constants/links';
import { getPooledTickers } from '@/utils/helpers/pools';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';
import { useGetCurrencies } from '@/utils/hooks/api/use-get-currencies';
import useQueryParams from '@/utils/hooks/use-query-params';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

const Swap = (): JSX.Element => {
  const query = useQueryParams();

  const { data: liquidityPools, refetch } = useGetLiquidityPools();
  const { getCurrencyFromTicker } = useGetCurrencies(true);

  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  const pooledTickers = useMemo(() => liquidityPools && getPooledTickers(liquidityPools), [liquidityPools]);

  useEffect(() => {
    if (!pooledTickers) return;

    const inputQuery = query.get(QUERY_PARAMETERS.SWAP.FROM);
    const outputQuery = query.get(QUERY_PARAMETERS.SWAP.TO);

    const fromCurrency = inputQuery ? getCurrencyFromTicker(inputQuery) : RELAY_CHAIN_NATIVE_TOKEN;
    const toCurrency = outputQuery ? getCurrencyFromTicker(outputQuery) : undefined;

    setPair({ input: fromCurrency, output: toCurrency });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pooledTickers]);

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
          pooledTickers={pooledTickers}
          onChangePair={handleChangePair}
          onSwap={refetch}
        />
        {pair.input && pair.output && liquidityPool && (
          <SwapLiquidity input={pair.input} output={pair.output} liquidityPool={liquidityPool} />
        )}
      </StyledWrapper>
    </MainContainer>
  );
};

export default Swap;
