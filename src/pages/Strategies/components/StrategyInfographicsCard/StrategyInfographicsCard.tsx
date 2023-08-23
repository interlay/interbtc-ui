import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, H2, P } from '@/component-library';

import { StrategyInfographics, StrategyInfographicsProps } from '../StrategyInfographics';

type Props = {
  description: ReactNode;
  infographics: Pick<StrategyInfographicsProps, 'items' | 'isCyclic' | 'endCycleLabel'>;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyInfographicsCardProps = Props & InheritAttrs;

const StrategyInfographicsCard = ({
  description,
  infographics,
  ...props
}: StrategyInfographicsCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card role='article' gap='spacing4' {...props}>
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
  );
};

export { StrategyInfographicsCard };
export type { StrategyInfographicsCardProps };
