import { CoinIcon } from '@/component-library';
import { STRATEGIES, StrategyType } from '@/types/strategies';

import { StrategyPageInsights } from '../StrategyPageInsights';
import { StrategyTag } from '../StrategyTag';
import {
  StyledStrategyPageHeader,
  StyledStrategyPageHeaderTags,
  StyledStrategyPageHeaderTitle
} from './StrategyPageHeader.style';

type Props = {
  strategyType: StrategyType;
};

const StrategyPageHeader = ({ strategyType }: Props): JSX.Element => {
  const { title, currency, tags, risk } = STRATEGIES[strategyType];
  return (
    <StyledStrategyPageHeader>
      <StyledStrategyPageHeaderTitle>
        <CoinIcon ticker={currency.ticker} /> {title}
      </StyledStrategyPageHeaderTitle>
      <StyledStrategyPageHeaderTags>
        <StrategyTag risk={risk} />
        {tags.map((tag) => (
          <StrategyTag key={tag}>{tag}</StrategyTag>
        ))}
      </StyledStrategyPageHeaderTags>
      <StrategyPageInsights strategyType={strategyType} />
    </StyledStrategyPageHeader>
  );
};

export { StrategyPageHeader };
