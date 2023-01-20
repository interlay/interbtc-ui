import { useState } from 'react';

import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import { useGetLiquidityPools } from '@/utils/hooks/api/amm/use-get-liquidity-pools';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

const Swap = (): JSX.Element => {
  // const accountId = useAccountId();
  const { data: liquidityPools } = useGetLiquidityPools();
  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  if (liquidityPools === undefined) {
    return <FullLoadingSpinner />;
  }

  // TODO: might be necessary
  const liquidityPool = liquidityPools.find(
    (obj) =>
      obj.pooledCurrencies.some((val) => val.currency.ticker === pair.input?.ticker) &&
      obj.pooledCurrencies.some((val) => val.currency.ticker === pair.output?.ticker)
  );

  const handleChangePair = (pair: SwapPair) => setPair(pair);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8'>
        <SwapForm pair={pair} liquidityPools={liquidityPools} onChangePair={handleChangePair} />
        {pair.input && pair.output && (
          <SwapLiquidity input={pair.input} output={pair.output} liquidityPool={liquidityPool} />
        )}
      </StyledWrapper>
    </MainContainer>
  );
};

export default Swap;
