import styled from 'styled-components';

import { XMark } from '@/assets/icons';
import { ReactComponent as BTCDefi } from '@/assets/img/btc-defi.svg';
import { Card, CTA, CTALink, Flex, H2, P, theme } from '@/component-library';

const StyledCard = styled(Card)`
  position: relative;
  overflow: hidden;
  z-index: 0;
  background-color: #1a0144;
`;

const StyledImageWrapper = styled(Flex)`
  display: none;
  flex: 0;

  @media ${theme.breakpoints.up('md')} {
    display: flex;
    margin-right: ${theme.spacing.spacing6};
  }

  @media ${theme.breakpoints.up('lg')} {
    margin-right: ${theme.spacing.spacing10};
  }
`;

const StyledSVG = styled(BTCDefi)`
  width: 9.875rem;
  height: 8.125rem;

  @media ${theme.breakpoints.up('md')} {
    display: block;
    top: ${theme.spacing.spacing8};
    bottom: ${theme.spacing.spacing8};
    right: ${theme.spacing.spacing18};
  }
`;

const StyledTextWrapper = styled(Flex)`
  @media ${theme.breakpoints.up('md')} {
    max-width: 70%;
  }
`;

const StyledCloseCTA = styled(CTA)`
  position: absolute;
  top: ${theme.spacing.spacing3};
  right: ${theme.spacing.spacing3};
`;

const StyledXMark = styled(XMark)`
  color: var(--colors-neutral-white);
`;

const StyledP = styled(P)`
  color: #ffffffb2;
`;

const StyledCTALink = styled(CTALink)`
  border-radius: ${theme.rounded.lg};
  font-size: ${theme.text.s};
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing6};
  color: #1a0144;
  background-color: var(--colors-neutral-white);

  &:hover:not([disabled]) {
    background-color: var(--colors-neutral-lighter-grey);
  }
`;

const StyledTitle = styled(H2)`
  color: var(--colors-neutral-white);
  font-size: ${theme.text.lg};
`;

export {
  StyledCard,
  StyledCloseCTA,
  StyledCTALink,
  StyledImageWrapper,
  StyledP,
  StyledSVG,
  StyledTextWrapper,
  StyledTitle,
  StyledXMark
};
