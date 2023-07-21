import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { formatPercentage } from '@/common/utils/utils';
import { Card, CardProps, CoinIcon, Flex, H1, P, Strong } from '@/component-library';
import { STRATEGIES, StrategyType } from '@/types/strategies';
import { PAGES } from '@/utils/constants/links';

import { useGetStrategyInsights } from '../../hooks/use-get-strategy-insights';
import { StrategyTag } from '../StrategyTag';
import { StyledEarningCard, StyledEarnSection } from './StrategyCard.style';

type Props = {
  strategyType: StrategyType;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyCardProps = Props & InheritAttrs;

const StrategyCard = ({ strategyType, ...props }: StrategyCardProps): JSX.Element => {
  const { t } = useTranslation();
  const { interest } = useGetStrategyInsights(strategyType);
  const { descriptionCard, title, currency, risk, path, tags } = STRATEGIES[strategyType];

  const interestPercentageLable = formatPercentage(interest);

  return (
    <Link to={`${PAGES.STRATEGIES}/${path}`}>
      <Card {...props} alignItems='center' gap='spacing4'>
        <Flex alignSelf='flex-start' gap='spacing1'>
          <StrategyTag risk={risk} />
          {tags.map((tag) => (
            <StrategyTag key={tag}>{tag}</StrategyTag>
          ))}
        </Flex>
        <CoinIcon size='xl2' ticker={currency.ticker} />
        <H1 weight='bold' size='base' align='center' rows={1}>
          {title}
        </H1>
        <StyledEarningCard justifyContent='center'>
          <StyledEarnSection size='xs' align='center'>
            Earn up to
            <Strong size='base'>
              {interestPercentageLable} {t('apy')}
            </Strong>
          </StyledEarnSection>
        </StyledEarningCard>
        <P color='tertiary' size='xs' align='center'>
          {descriptionCard}
        </P>
      </Card>
    </Link>
  );
};

export { StrategyCard };
export type { StrategyCardProps };
