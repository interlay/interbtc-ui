import { withErrorBoundary } from 'react-error-boundary';

import { Card, P } from '@/component-library';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';
import { StrategyType } from '@/types/strategies';

import { StrategyCard } from './components';
import { StyledList } from './Strategies.style';

const Strategies = (): JSX.Element => {
  return (
    <MainContainer>
      <Card>
        <P size='xs'>
          Discover straightforward strategies with attractive annual percentage yields (APY) of up to 33.22%. Customize
          your collateral and define your preferred risk parameters. Benefit from one-click aping, saving you time and
          transaction fees!
        </P>
      </Card>
      <StyledList>
        {Object.values(StrategyType).map((strategyType) => (
          <StrategyCard key={strategyType} strategyType={strategyType} />
        ))}
        <Card alignItems='center' justifyContent='center'>
          <P size='xs'>More Strategies coming soon</P>
        </Card>
      </StyledList>
    </MainContainer>
  );
};

export default withErrorBoundary(Strategies, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
