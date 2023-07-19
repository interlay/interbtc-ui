import Big from 'big.js';
import { withErrorBoundary } from 'react-error-boundary';

import { Card, P } from '@/component-library';
import { WRAPPED_TOKEN } from '@/config/relay-chains';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import MainContainer from '@/parts/MainContainer';
import { StrategyData, StrategyRisk } from '@/types/strategies';

import { StrategyCard } from './components';
import { StyledList } from './Strategies.style';

const STRATEGIES: StrategyData[] = [
  { currency: WRAPPED_TOKEN, interestPercentage: new Big(3.22), interestType: 'apy', risk: StrategyRisk.LOW }
];

const Strategies = (): JSX.Element => {
  const handlePress = () => {
    // window.open(`${PAGES.STRATEGIES}/...`)
  };

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
        {STRATEGIES.map((startegy, key) => (
          <StrategyCard
            key={key}
            risk={startegy.risk}
            isPressable
            onPress={handlePress}
            currency={startegy.currency}
            interestType={startegy.interestType}
            interestPercentage={startegy.interestPercentage}
            title='BTC Passive Income'
            description='Generate passive income by offering your IBTC to lending markets and benefit from automatic compounding rewards.'
          />
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
