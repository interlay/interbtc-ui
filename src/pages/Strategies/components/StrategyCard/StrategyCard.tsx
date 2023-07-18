import { CurrencyExt } from '@interlay/interbtc-api';
import Big from 'big.js';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { formatPercentage } from '@/common/utils/utils';
import { Card, CardProps, CoinIcon, Flex, H1, P, Strong } from '@/component-library';
import { StrategyRisk } from '@/types/strategies';

import { StrategyTag } from '../StrategyTag';
import { StyledEarningCard, StyledEarnSection } from './StrategyCard.style';

type Props = {
  currency: CurrencyExt;
  interestType: 'apy' | 'apr';
  interestPercentage: Big;
  title: ReactNode;
  description: ReactNode;
  risk: StrategyRisk;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type StrategyCardProps = Props & InheritAttrs;

const StrategyCard = ({
  interestType,
  interestPercentage,
  currency,
  description,
  risk,
  title,
  ...props
}: StrategyCardProps): JSX.Element => {
  const { t } = useTranslation();

  const interestTypeLabel = interestType === 'apr' ? t('apr') : t('apy');
  const interestPercentageLable = formatPercentage(interestPercentage.toNumber());

  return (
    <Card {...props} alignItems='center' gap='spacing4'>
      <Flex alignSelf='flex-start' gap='spacing1'>
        <StrategyTag variant='risk' risk={risk} />
        <StrategyTag variant='passive-income' />
      </Flex>
      <CoinIcon size='xl2' ticker={currency.ticker} />
      <H1 weight='bold' size='base' align='center' rows={1}>
        {title}
      </H1>
      <StyledEarningCard justifyContent='center'>
        <StyledEarnSection size='xs' align='center'>
          Earn up to
          <Strong size='base'>
            {interestPercentageLable} {interestTypeLabel}
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
