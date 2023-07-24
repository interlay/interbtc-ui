import { CoinIcon } from '@/component-library';
import { Icon } from '@/component-library/Icon';
import { STRATEGIES, StrategyType } from '@/types/strategies';

import { StyledStrategyPageInfographics, StyledStrategyPageInfographicsNode } from './StrategyPageInfographics.style';

type StrategyPageInfographicsProps = {
  strategyType: StrategyType;
};

const StrategyPageInfographics = ({ strategyType }: StrategyPageInfographicsProps): JSX.Element => {
  const { currency, infographicsMiddleNode } = STRATEGIES[strategyType];

  const MiddleIcon = infographicsMiddleNode.icon;

  return (
    <StyledStrategyPageInfographics>
      <StyledStrategyPageInfographicsNode>
        <CoinIcon size='xl2' ticker={currency.ticker} />
        Deposit {currency.ticker}
      </StyledStrategyPageInfographicsNode>
      <StyledStrategyPageInfographicsNode>
        <Icon size='xl2'>
          <MiddleIcon />
        </Icon>
        {infographicsMiddleNode.text}
      </StyledStrategyPageInfographicsNode>
      <StyledStrategyPageInfographicsNode>
        <CoinIcon size='xl2' ticker={currency.ticker} />
        Earn interest
      </StyledStrategyPageInfographicsNode>
    </StyledStrategyPageInfographics>
  );
};

export { StrategyPageInfographics };
