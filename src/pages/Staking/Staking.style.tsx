import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

import { StakingForm } from './components';

const StyledWrapper = styled(Flex)`
  max-width: 840px;
  margin: 0 auto;
  flex-direction: column-reverse;

  @media ${theme.breakpoints.up('lg')} {
    flex-direction: row;
  }
`;

const StyledStakingForm = styled(StakingForm)`
  min-width: 540px;
  width: 100%;
  flex: 1 1 540px;
`;

export { StyledStakingForm, StyledWrapper };
