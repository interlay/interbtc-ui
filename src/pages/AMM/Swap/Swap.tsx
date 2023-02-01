import { isCurrencyEqual } from '@interlay/interbtc-api';
import { useState } from 'react';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

const Swap = (): JSX.Element => {
  const { data: liquidityPools, refetch } = useGetLiquidityPools();
  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  if (liquidityPools === undefined) {
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
        <SwapForm pair={pair} liquidityPools={liquidityPools} onChangePair={handleChangePair} onSwap={refetch} />
        {pair.input && pair.output && liquidityPool && (
          <SwapLiquidity input={pair.input} output={pair.output} liquidityPool={liquidityPool} />
        )}
      </StyledWrapper>
    </MainContainer>
  );
};

export default Swap;
