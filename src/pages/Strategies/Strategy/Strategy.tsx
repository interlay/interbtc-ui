import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { BreadcrumbItem, Breadcrumbs, CoinIcon, Flex, H1 } from '@/component-library';
import { MainContainer } from '@/components';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';

import { StrategyInsights, StrategyTag } from '../components';
import { getContent } from '../helpers/content';
import { useGetStrategies } from '../hooks/use-get-strategies';
import { useGetStrategyPosition } from '../hooks/use-get-strategy-position';
import { StrategyRisk, StrategySlug, StrategyType } from '../types';
import {
  StyledFlex,
  StyledStrategyForm,
  StyledStrategyInfographicsCard,
  StyledStrategyLeverageStats,
  StyledStrategyRiskCard
} from './Strategy.styles';

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
    <MainContainer gap='spacing4'>
      <Flex direction='column' gap='spacing4'>
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
      <StyledFlex>
        <StyledStrategyForm flex='1' strategy={strategy} position={position} />
        {strategy.type === StrategyType.LEVERAGE_LONG && <StyledStrategyLeverageStats />}
        <StyledStrategyInfographicsCard description={description} infographics={infographics} />
        <StyledStrategyRiskCard />
      </StyledFlex>
    </MainContainer>
  );
};

export { Strategy };
