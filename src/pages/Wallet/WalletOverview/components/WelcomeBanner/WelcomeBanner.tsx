import { ReactNode } from 'react';

import BitcoinStrategyLogo from '@/assets/img/bitcoin-strategy.svg';
import { CTALink, Flex, H1, P } from '@/component-library';

import { StyledCard, StyledImage, StyledImageWrapper, StyledTextWrapper } from './WelcomeBanner.styles';

type WelcomeBannerProps = {
  title: ReactNode;
  description: ReactNode;
};

const WelcomeBanner = ({ title, description }: WelcomeBannerProps): JSX.Element => {
  return (
    <StyledCard alignItems='flex-start' gap='spacing4'>
      <StyledImageWrapper>
        <StyledImage src={BitcoinStrategyLogo} alt='coin strategy' />
      </StyledImageWrapper>
      <StyledTextWrapper direction='column' gap='spacing4'>
        <H1 size='xl2'>{title}</H1>
        <P size='s' color='tertiary'>
          {description}
        </P>
      </StyledTextWrapper>
      <Flex>
        <CTALink external to='#'>
          Whitepaper
        </CTALink>
        <CTALink external to='#'>
          How can I fund my wallet
        </CTALink>
      </Flex>
    </StyledCard>
  );
};

export { WelcomeBanner };
export type { WelcomeBannerProps };
