import { useTranslation } from 'react-i18next';

import { Flex } from '@/component-library';
import { INTERLAY_WHITEPAPPER } from '@/config/links';
import { APP_NAME, WRAPPED_TOKEN } from '@/config/relay-chains';
import { PAGES } from '@/utils/constants/links';

import {
  StyledCard,
  StyledCloseCTA,
  StyledCTAGroup,
  StyledCTALink,
  StyledImageWrapper,
  StyledP,
  StyledSVG,
  StyledTextWrapper,
  StyledTitle,
  StyledXMark
} from './WelcomeBanner.styles';

type WelcomeBannerProps = {
  onClose: () => void;
};

const WelcomeBanner = ({ onClose }: WelcomeBannerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <StyledCard direction='row' gap='spacing4' justifyContent='space-between' alignItems='center'>
      <StyledTextWrapper direction='column' gap='spacing6'>
        <Flex direction='column' gap='spacing4'>
          <StyledTitle weight='bold' size='xl2'>
            {t('wallet.welcome_to_dapp', { name: APP_NAME })}
          </StyledTitle>
          <StyledP size='s' color='tertiary'>
            {t('wallet.dapp_is_a_one_stop_shop_for_bitcoin_defi', {
              name: APP_NAME,
              wrappedToken: WRAPPED_TOKEN.ticker
            })}
          </StyledP>
        </Flex>
        <StyledCTAGroup gap='spacing4'>
          <StyledCTALink fullWidth external icon to={INTERLAY_WHITEPAPPER}>
            Whitepaper
          </StyledCTALink>
          {/* TODO: to be added */}
          <StyledCTALink fullWidth external icon to={'#'}>
            Fund Wallet Guide
          </StyledCTALink>
          <StyledCTALink fullWidth to={PAGES.ONBOARDING}>
            Tutorial
          </StyledCTALink>
        </StyledCTAGroup>
      </StyledTextWrapper>
      <StyledImageWrapper>
        <StyledSVG aria-label='bitcoin defi' />
      </StyledImageWrapper>
      <StyledCloseCTA size='small' variant='text' aria-label='dimiss welcome banner' onPress={onClose}>
        <StyledXMark />
      </StyledCloseCTA>
    </StyledCard>
  );
};

export { WelcomeBanner };
export type { WelcomeBannerProps };
