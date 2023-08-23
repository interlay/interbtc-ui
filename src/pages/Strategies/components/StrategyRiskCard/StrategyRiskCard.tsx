import { useTranslation } from 'react-i18next';

import { Card, CardProps, H2, P, TextLink } from '@/component-library';

type StrategyRiskCardProps = CardProps;

const StrategyRiskCard = (props: StrategyRiskCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card gap='spacing4' {...props}>
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
  );
};

export { StrategyRiskCard };
export type { StrategyRiskCardProps };
