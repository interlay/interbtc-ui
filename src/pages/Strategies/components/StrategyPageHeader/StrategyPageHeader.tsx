import { CoinIcon } from '@/component-library';

import { STRATEGY_INFORMATION, StrategyType } from '../../types';
import { StrategyPageInsights } from '../StrategyPageInsights';
import {
  StyledStrategyPageHeader,
  StyledStrategyPageHeaderTag,
  StyledStrategyPageHeaderTags,
  StyledStrategyPageHeaderTitle
} from './StrategyPageHeader.style';

type Props = {
  strategyType: StrategyType;
};

const StrategyPageHeader = ({ strategyType }: Props): JSX.Element => {
  const { title, currency, tags } = STRATEGY_INFORMATION[strategyType];
  return (
    <StyledStrategyPageHeader>
      <StyledStrategyPageHeaderTitle>
        <CoinIcon ticker={currency.ticker} /> {title}
      </StyledStrategyPageHeaderTitle>
      <StyledStrategyPageHeaderTags>
        {tags.map((tag) => (
          <StyledStrategyPageHeaderTag key={tag}>{tag}</StyledStrategyPageHeaderTag>
        ))}
      </StyledStrategyPageHeaderTags>
      <StrategyPageInsights strategyType={strategyType} />
    </StyledStrategyPageHeader>
  );
};

export { StrategyPageHeader };
