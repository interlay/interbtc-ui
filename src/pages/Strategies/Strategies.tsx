import { withErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Card, P, TextLink } from '@/component-library';
import { MainContainer } from '@/components';
import ErrorFallback from '@/legacy-components/ErrorFallback';
import FullLoadingSpinner from '@/legacy-components/FullLoadingSpinner';
import { PAGES, URL_PARAMETERS } from '@/utils/constants/links';

import { StrategyCard } from './components';
import { getContent } from './helpers/content';
import { useGetStrategies } from './hooks/use-get-strategies';
import { StyledList } from './Strategies.style';

const Strategies = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: strategies } = useGetStrategies();

  if (!strategies) {
    return <FullLoadingSpinner />;
  }

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
        {strategies.map((strategy) => {
          const { title, summary } = getContent(strategy, t);

          const to = PAGES.STRATEGY.replace(`:${URL_PARAMETERS.STRATEGY.TYPE}`, strategy.type);

          return (
            <Link key={strategy.type} to={to}>
              <StrategyCard
                risk={strategy.risk}
                ticker={strategy.currency.ticker}
                interestRate={strategy.interestRate}
                title={title}
                description={summary}
              />
            </Link>
          );
        })}
        <Card alignItems='center' justifyContent='center'>
          <P size='xs'>More Strategies coming soon</P>
          <TextLink size='xs' underlined to={'#'}>
            Request strategies
          </TextLink>
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
