import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

import { StrategyForm } from '../components/StrategyForm';

const StyledStrategyForm = styled(StrategyForm)`
  height: min-content;
`;

const StyledFlex = styled(Flex)`
  flex-direction: column;

  @media ${theme.breakpoints.up('md')} {
    flex-direction: row;
  }
`;

const StyledInfoCards = styled(Flex)`
  height: min-content;
`;

export { StyledFlex, StyledInfoCards, StyledStrategyForm };
