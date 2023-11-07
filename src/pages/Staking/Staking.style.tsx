import styled from 'styled-components';

import { Flex, theme } from '@/component-library';

import { StakingForm } from './components';

const StyledWrapper = styled(Flex)`
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  flex-direction: column-reverse;

  @media ${theme.breakpoints.up('lg')} {
    flex-direction: row;
  }
`;

const StyledStakingForm = styled(StakingForm)`
  width: 100%;
  flex: 1 1 540px;

  @media ${theme.breakpoints.up('lg')} {
    min-width: 540px;
  }
`;

const StyledStakingDetails = styled(Flex)`
  min-width: 290px;
`;

export { StyledStakingDetails, StyledStakingForm, StyledWrapper };
