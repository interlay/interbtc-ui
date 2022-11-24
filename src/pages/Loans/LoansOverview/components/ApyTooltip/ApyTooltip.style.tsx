import styled from 'styled-components';

import { Dd, DlGroup, theme, Tooltip } from '@/component-library';

const StyledApyTooltipTitle = styled(Dd)`
  font-weight: ${theme.fontWeight.bold};
`;

const StyledApyTooltipGroup = styled(DlGroup)`
  font-weight: ${theme.fontWeight.medium};
`;

const StyledTooltip = styled(Tooltip)`
  font-size: ${theme.text.xs};
`;

export { StyledApyTooltipGroup, StyledApyTooltipTitle, StyledTooltip };
