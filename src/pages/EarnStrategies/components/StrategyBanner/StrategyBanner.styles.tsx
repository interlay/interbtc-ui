import styled from 'styled-components';

import { Card, Flex, Span, theme } from '@/component-library';

const StyledTag = styled(Span)`
  padding: ${theme.spacing.spacing2} ${theme.spacing.spacing4};
  background-color: #aefef1;
  color: #000000;
  border-radius: ${theme.rounded.md};
`;

const StyledCard = styled(Card)`
  position: relative;
  overflow: hidden;
  z-index: 0;
  background-color: #180d2c;
`;

const StyledImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  text-align: right;
`;

const StyledImage = styled.img`
  width: 50%;
  opacity: 0.4;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(10%, 50%);

  @media ${theme.breakpoints.up('sm')} {
    width: 30%;
    position: static;
    transform: translate(0, 0);
  }

  @media ${theme.breakpoints.up('md')} {
    transform: translate(10%, -10%);
  }
`;

const StyledTextWrapper = styled(Flex)`
  @media ${theme.breakpoints.up('sm')} {
    max-width: 70%;
  }
`;

export { StyledCard, StyledImage, StyledImageWrapper, StyledTag, StyledTextWrapper };
