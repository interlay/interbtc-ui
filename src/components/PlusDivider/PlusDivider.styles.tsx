import styled from 'styled-components';

import { Divider, theme } from '@/component-library';

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
  background-color: var(--colors-token-input-end-adornment-bg);
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

const StyledDivider = styled(Divider)`
  background-color: var(--colors-token-input-end-adornment-bg);
`;

export { StyledBackground, StyledCircle, StyledDivider, StyledWrapper };
