import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { Card, CoinIcon, Flex, H1, H2, P, TextLink } from '@/component-library';
import { MainContainer } from '@/components';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';

import { StrategyInfographics, StrategyInsights, StrategyTag } from '../components';
import { getContent } from '../helpers/content';
import { useGetStrategies } from '../hooks/use-get-strategies';
import { useGetStrategyPosition } from '../hooks/use-get-strategy-position';
import { StrategyRisk, StrategyType } from '../types';
import { StyledFlex, StyledStrategyForm } from './Strategy.styles';

const StrategyPage = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { [URL_PARAMETERS.STRATEGY_TYPE]: strategyType } = useParams<Record<string, any>>();
  const { replace } = useHistory();
  const { data: strategies, getStrategy } = useGetStrategies();
  const { data: position } = useGetStrategyPosition(strategyType);

  if (!strategies || !position) {
    return <FullLoadingSpinner />;
  }

  const strategy = getStrategy(strategyType as StrategyType);

  if (!strategy) {
    // If strategy URL is invalid redirect to strategy landing page.
    replace(PAGES.STRATEGIES);

    return null;
  }

  const { title, description, infographics } = getContent(t, strategyType);

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing6'>
        <H1 size='lg' weight='bold'>
          <Flex elementType='span' alignItems='center' gap='spacing2'>
            <CoinIcon ticker={strategy.currency.ticker} /> {title}
          </Flex>
        </H1>
        <Flex gap='spacing2'>
          <StrategyTag risk={strategy.risk} />
          {strategy.risk === StrategyRisk.LOW && <StrategyTag>Passive Income</StrategyTag>}
        </Flex>
      </Flex>
      <StrategyInsights position={position} stratetgy={strategy} />
      <Flex gap='spacing6'>
        <StyledStrategyForm flex='1' type={strategyType} />
        <StyledFlex flex='1' direction='column' gap='spacing6'>
          <Card gap='spacing4'>
            <H2 size='s' weight='bold'>
              How does it work?
            </H2>
            <P color='tertiary' size='s'>
              {description}
            </P>
            <Card shadowed={false} variant='bordered' background='tertiary'>
              <StrategyInfographics items={infographics} />
            </Card>
          </Card>
          <Card gap='spacing4'>
            <H2 size='s' weight='bold'>
              What are the risks?
            </H2>
            <P color='tertiary' size='s'>
              Discover the fundamental origins of the position, potential risks involved, the allocation of your
              capital, and other pertinent details in the docs section.
            </P>
            <TextLink size='s' weight='bold' external to='https://docs.interlay.io'>
              Learn more &gt;
            </TextLink>
          </Card>
        </StyledFlex>
      </Flex>
    </MainContainer>
  );
};

export { StrategyPage };
