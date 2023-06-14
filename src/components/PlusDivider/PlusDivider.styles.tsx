import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledCircle = styled.div`
  display: inline-flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing2};
  background-color: var(--colors-border);
  border-radius: ${theme.rounded.full};
`;

const StyledBackground = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: ${theme.spacing.spacing1} ${theme.spacing.spacing8};
  background-color: ${theme.colors.bgPrimary};
`;

export { StyledBackground, StyledCircle, StyledWrapper };
