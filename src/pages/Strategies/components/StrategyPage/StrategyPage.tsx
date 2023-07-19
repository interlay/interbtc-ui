import { TextLink } from '@/component-library';
import { Text } from '@/component-library/Text/style';

import { STRATEGY_INFORMATION, StrategyType } from '../../types';
import { StrategyForm } from '..';
import { StrategyPageHeader } from '../StrategyPageHeader';
import {
  StyledStrategyPageInfoCard,
  StyledStrategyPageInformation,
  StyledStrategyPageLayout,
  StyledStrategyPageMainContent
} from './StrategyPage.style';

const StrategyPage = (): JSX.Element => {
  // TODO: get from url or pass as prop
  const strategyType = StrategyType.LOW_RISK_SIMPLE_WRAPPED;

  return (
    <StyledStrategyPageLayout>
      <StrategyPageHeader strategyType={strategyType} />
      <StyledStrategyPageMainContent>
        <StrategyForm strategyType={strategyType} />
        <StyledStrategyPageInformation>
          <StyledStrategyPageInfoCard>
            <Text $weight='bold'>How does it work?</Text>
            {/* TODO: add infographics <img /> */}
            {STRATEGY_INFORMATION[strategyType].description}
          </StyledStrategyPageInfoCard>
          <StyledStrategyPageInfoCard>
            <Text $weight='bold'>What are the risks?</Text>
            Discover the fundamental origins of the position, potential risks involved, the allocation of your capital,
            and other pertinent details in the docs section.
            <TextLink external to={STRATEGY_INFORMATION[strategyType].riskInformationLink}>
              Learn more
            </TextLink>
          </StyledStrategyPageInfoCard>
        </StyledStrategyPageInformation>
      </StyledStrategyPageMainContent>
    </StyledStrategyPageLayout>
  );
};

export { StrategyPage };
