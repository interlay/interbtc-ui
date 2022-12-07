import styled from 'styled-components';

import { DlGroup, Dt, theme, Tooltip } from '@/component-library';

const StyledApyTooltipTitle = styled(Dt)`
  font-weight: ${theme.fontWeight.bold};
`;

const StyledApyTooltipGroup = styled(DlGroup)`
  font-weight: ${theme.fontWeight.medium};
`;

const StyledTooltip = styled(Tooltip)`
  font-size: ${theme.text.xs};
`;

export { StyledApyTooltipGroup, StyledApyTooltipTitle, StyledTooltip };
