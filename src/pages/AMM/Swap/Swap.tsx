import { useState } from 'react';

import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './Swap.style';

const Swap = (): JSX.Element => {
  // const accountId = useAccountId();
  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  // if () {
  //   return <FullLoadingSpinner />;
  // }

  const handleChangePair = (pair: SwapPair) => setPair(pair);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8'>
        <SwapForm pair={pair} onChangePair={handleChangePair} />
        {pair.input && pair.output && <SwapLiquidity input={pair.input} output={pair.output} />}
      </StyledWrapper>
    </MainContainer>
  );
};

export default Swap;
