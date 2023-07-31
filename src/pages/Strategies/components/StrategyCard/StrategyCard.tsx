import Big from 'big.js';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage } from '@/common/utils/utils';
import { Card, CardProps, CoinIcon, Flex, H1, P, Strong } from '@/component-library';

import { StrategyRisk } from '../../types';
import { StrategyTag } from '../StrategyTag';
import { StyledEarningCard, StyledEarnSection } from './StrategyCard.style';

type Props = {
  title: ReactNode;
  description: ReactNode;
  ticker: string;
  risk: StrategyRisk;
  interestRate: Big;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyCardProps = Props & InheritAttrs;

const StrategyCard = ({ title, description, ticker, risk, interestRate, ...props }: StrategyCardProps): JSX.Element => {
  const { t } = useTranslation();

  const interestPercentageLable = formatPercentage(interestRate.toNumber());

  return (
    <Card {...props} alignItems='center' gap='spacing4'>
      <Flex alignSelf='flex-start' gap='spacing1'>
        <StrategyTag risk={risk} />
        {risk === StrategyRisk.LOW && <StrategyTag>Passive Income</StrategyTag>}
      </Flex>
      <CoinIcon size='xl2' ticker={ticker} />
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
        {description}
      </P>
    </Card>
  );
};

export { StrategyCard };
export type { StrategyCardProps };
