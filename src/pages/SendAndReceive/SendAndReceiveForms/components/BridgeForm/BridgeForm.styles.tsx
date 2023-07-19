import styled from 'styled-components';

import { ArrowRightCircle } from '@/assets/icons';
import { Flex, theme } from '@/component-library';

import { ChainSelect } from '../ChainSelect';

const StyledArrowRightCircle = styled(ArrowRightCircle)`
  transform: rotate(90deg);
  align-self: center;

  @media (min-width: 30em) {
    transform: rotate(0deg);
    margin-top: 1.75rem;
  }
`;

const ChainSelectSection = styled(Flex)`
  flex-direction: column;

  @media (min-width: 30em) {
    flex-direction: row;
    gap: ${theme.spacing.spacing4};
  }
`;

const StyledSourceChainSelect = styled(ChainSelect)`
  margin-bottom: ${theme.spacing.spacing3};

  @media (min-width: 30em) {
    margin-bottom: 0;
  }
`;

export { ChainSelectSection, StyledArrowRightCircle, StyledSourceChainSelect };
