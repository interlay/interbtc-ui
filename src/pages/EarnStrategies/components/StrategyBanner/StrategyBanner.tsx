import { ReactNode } from 'react';

import BitcoinStrategyLogo from '@/assets/img/bitcoin-strategy.svg';
import { H1, P } from '@/component-library';

import { StyledCard, StyledImage, StyledImageWrapper, StyledTag, StyledTextWrapper } from './StrategyBanner.styles';

type StrategyBannerProps = {
  title: ReactNode;
  description: ReactNode;
};

const StrategyBanner = ({ title, description }: StrategyBannerProps): JSX.Element => {
  return (
    <StyledCard alignItems='flex-start' gap='spacing4'>
      <StyledImageWrapper>
        <StyledImage src={BitcoinStrategyLogo} alt='coin strategy' />
      </StyledImageWrapper>
      <StyledTextWrapper direction='column' gap='spacing2'>
        <H1 size='xl2'>{title}</H1>
        <P size='s' color='tertiary'>
          {description}
        </P>
      </StyledTextWrapper>
      <StyledTag>Low Risk</StyledTag>
    </StyledCard>
  );
};

export { StrategyBanner };
export type { StrategyBannerProps };
