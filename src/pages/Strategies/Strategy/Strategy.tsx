import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { BreadcrumbItem, Breadcrumbs, Card, CoinIcon, Flex, H1, H2, P, TextLink } from '@/component-library';
import { MainContainer } from '@/components';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';

import { StrategyInfographics, StrategyInsights, StrategyTag } from '../components';
import { getContent } from '../helpers/content';
import { useGetStrategies } from '../hooks/use-get-strategies';
import { useGetStrategyPosition } from '../hooks/use-get-strategy-position';
import { StrategyRisk, StrategySlug } from '../types';
import { StyledFlex, StyledInfoCards, StyledStrategyForm } from './Strategy.styles';

const Strategy = (): JSX.Element | null => {
  const { t } = useTranslation();
  const { [URL_PARAMETERS.STRATEGY.SLUG]: strategySlug } = useParams<Record<string, StrategySlug>>();
  const { replace } = useHistory();
  const { data: strategies, getStrategy } = useGetStrategies();

  const strategy = getStrategy(strategySlug);

  const { data: position, isLoading: isPositionLoading } = useGetStrategyPosition(strategy);

  if (!strategies || isPositionLoading) {
    return <FullLoadingSpinner />;
  }

  if (!strategy) {
    // If strategy URL is invalid redirect to strategy landing page.
    replace(PAGES.STRATEGIES);

    return null;
  }

  const { title, description, infographics } = getContent(strategy, t);

  return (
    <MainContainer>
      <Flex direction='column' gap='spacing6'>
        <Breadcrumbs>
          <BreadcrumbItem to={PAGES.STRATEGIES}>{t('navigation.strategies')}</BreadcrumbItem>
          <BreadcrumbItem to='#'>{title}</BreadcrumbItem>
        </Breadcrumbs>
        <H1 size='lg' weight='bold'>
          <Flex elementType='span' alignItems='center' gap='spacing2'>
            <CoinIcon ticker={strategy.currencies.primary.ticker} /> {title}
          </Flex>
        </H1>
        <Flex gap='spacing2'>
          <StrategyTag risk={strategy.risk} />
          {strategy.risk === StrategyRisk.LOW && <StrategyTag>{t('strategies.passive_income')}</StrategyTag>}
        </Flex>
      </Flex>
      <StrategyInsights stratetgy={strategy} position={position} />
      <StyledFlex gap='spacing6'>
        <StyledStrategyForm flex='1' strategy={strategy} position={position} />
        <StyledInfoCards flex='1' direction='column' gap='spacing6'>
          <Card role='article' gap='spacing4'>
            <H2 size='s' weight='bold'>
              {t('strategies.how_does_it_work')}
            </H2>
            <P color='tertiary' size='s'>
              {description}
            </P>
            <Card shadowed={false} variant='bordered' background='tertiary'>
              <StrategyInfographics {...infographics} />
            </Card>
          </Card>
          <Card gap='spacing4'>
            <H2 size='s' weight='bold'>
              {t('strategies.what_are_the_risk')}
            </H2>
            <P color='tertiary' size='s'>
              {t('strategies.discover_fundamental_origins')}
            </P>
            <TextLink size='s' weight='bold' external to='https://docs.interlay.io'>
              {t('learn_more')} &gt;
            </TextLink>
          </Card>
        </StyledInfoCards>
      </StyledFlex>
    </MainContainer>
  );
};

export { Strategy };
