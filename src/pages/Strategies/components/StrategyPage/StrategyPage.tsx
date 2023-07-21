import { useHistory, useParams } from 'react-router';

import { TextLink } from '@/component-library';
import { Text } from '@/component-library/Text/style';
import { STRATEGIES } from '@/types/strategies';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';

import { StrategyForm } from '..';
import { StrategyPageHeader } from '../StrategyPageHeader';
import {
  StyledStrategyPageInfoCard,
  StyledStrategyPageInformation,
  StyledStrategyPageLayout,
  StyledStrategyPageMainContent
} from './StrategyPage.style';
import { getStrategyTypeFromUrlPath } from './utils';

const StrategyPage = (): JSX.Element => {
  const { [URL_PARAMETERS.STRATEGY_TYPE]: strategyTypePath } = useParams<Record<string, any>>();
  const { replace } = useHistory();

  const strategyType = getStrategyTypeFromUrlPath(strategyTypePath);

  if (strategyType === undefined) {
    // If strategy URL is invalid redirect to strategy landing page.
    replace(PAGES.STRATEGIES);
    return <></>;
  }

  return (
    <StyledStrategyPageLayout>
      <StrategyPageHeader strategyType={strategyType} />
      <StyledStrategyPageMainContent>
        <StrategyForm strategyType={strategyType} />
        <StyledStrategyPageInformation>
          <StyledStrategyPageInfoCard>
            <Text $weight='bold'>How does it work?</Text>
            {/* TODO: add infographics <img /> */}
            {STRATEGIES[strategyType].description}
          </StyledStrategyPageInfoCard>
          <StyledStrategyPageInfoCard>
            <Text $weight='bold'>What are the risks?</Text>
            Discover the fundamental origins of the position, potential risks involved, the allocation of your capital,
            and other pertinent details in the docs section.
            <TextLink external to='https://docs.interlay.io'>
              Learn more
            </TextLink>
          </StyledStrategyPageInfoCard>
        </StyledStrategyPageInformation>
      </StyledStrategyPageMainContent>
    </StyledStrategyPageLayout>
  );
};

export { StrategyPage };
