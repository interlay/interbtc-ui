import { useState } from 'react';

import FullLoadingSpinner from '@/components/FullLoadingSpinner';
import { RELAY_CHAIN_NATIVE_TOKEN } from '@/config/relay-chains';
import MainContainer from '@/parts/MainContainer';
import { SwapPair } from '@/types/swap';
import useAccountId from '@/utils/hooks/use-account-id';

import { SwapForm, SwapLiquidity } from './components';
import { StyledWrapper } from './SwapOverview.style';

const LoansOverview = (): JSX.Element => {
  const accountId = useAccountId();
  const [pair, setPair] = useState<SwapPair>({ input: RELAY_CHAIN_NATIVE_TOKEN });

  if (!accountId) {
    return <FullLoadingSpinner />;
  }

  const handleChangePair = (pair: SwapPair) => setPair(pair);

  return (
    <MainContainer>
      <StyledWrapper direction='column' gap='spacing8' alignItems='center'>
        <SwapForm pair={pair} onChangePair={handleChangePair} />
        {pair.output && <SwapLiquidity pair={pair as Required<SwapPair>} />}
      </StyledWrapper>
    </MainContainer>
  );
};

export default LoansOverview;
