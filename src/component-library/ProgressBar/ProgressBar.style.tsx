import styled from 'styled-components';

import { theme } from '../theme';
import { ProgressBarColors } from '../utils/prop-types';

type StyledFillProps = {
  $color: ProgressBarColors;
};

const StyledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  min-width: ${theme.spacing.spacing6};
  background-color: ${theme.progressBar.bg};
  height: 1px;
`;

const StyledFill = styled.div<StyledFillProps>`
  background-color: ${({ $color }) => ($color === 'red' ? theme.alert.status.error : theme.colors.textSecondary)};
  height: 1px;
  border: none;
  transition: width ${theme.transition.duration.duration100}ms;
  will-change: width;
`;

export { StyledFill, StyledTrack };
