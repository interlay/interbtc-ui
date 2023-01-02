import styled from 'styled-components';

import { CTA, theme } from '@/component-library';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCTA = styled(CTA)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing3};
  border-radius: ${theme.rounded.full};
  transition: transform ${theme.transition.duration.duration150}ms ease-in-out;

  &:hover {
    transform: translate(-50%, -50%) rotate(-180deg);
  }

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: ${theme.spacing.spacing6};
    background-color: ${theme.colors.bgPrimary};
    border-radius: ${theme.rounded.full};
  }
`;

export { StyledCTA, StyledWrapper };
